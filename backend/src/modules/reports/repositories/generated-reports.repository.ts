import { Injectable, type OnModuleInit, Optional } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type {
  GeneratedReport,
  ReportType,
} from '../types/generated-report.types.js';

@Injectable()
export class GeneratedReportsRepository implements OnModuleInit {
  private reports: GeneratedReport[] = [];

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this.prisma) {
      return;
    }

    try {
      const records = await this.prisma.adminExportHistory.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      const dbReports = records.map((record) => ({
        id: `${record.userId}_${record.createdAt.getTime()}`,
        fileName: record.reportName,
        reportType: record.reportType as ReportType,
        generatedAt: record.createdAt.toISOString(),
      }));

      // Preservar reportes recientes en memoria mientras se confirma la persistencia en Supabase
      const now = Date.now();
      const recentMemory = this.reports.filter(
        (r) => now - new Date(r.generatedAt).getTime() < 10000,
      );
      const dbKeys = new Set(dbReports.map((r) => `${r.fileName}_${r.generatedAt}`));
      const pendingRecent = recentMemory.filter(
        (r) => !dbKeys.has(`${r.fileName}_${r.generatedAt}`),
      );

      this.reports = [...pendingRecent, ...dbReports];
    } catch (error) {
      console.error('Error al sincronizar historial de reportes desde Prisma/Supabase:', error);
    }
  }

  findAll(): readonly GeneratedReport[] {
    void this.refresh();
    return this.reports;
  }

  create(report: GeneratedReport): GeneratedReport {
    this.reports.unshift(report);

    if (this.prisma) {
      void (async () => {
        try {
          const user = await this.prisma!.user.findFirst();
          if (user) {
            await this.prisma!.adminExportHistory.create({
              data: {
                userId: user.id,
                reportName: report.fileName,
                reportType: report.reportType,
                createdAt: new Date(report.generatedAt),
              },
            });
          }
        } catch (error) {
          console.error('Error al persistir reporte generado en admin_export_histories:', error);
        }
      })();
    }

    return report;
  }
}

