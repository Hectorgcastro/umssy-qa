import {
  Injectable,
  Logger,
  type OnModuleInit,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type {
  GeneratedReport,
  ReportType,
} from '../types/generated-report.types.js';

@Injectable()
export class GeneratedReportsRepository implements OnModuleInit {
  private readonly logger = new Logger(GeneratedReportsRepository.name);
  private reports: GeneratedReport[] = [];
  private refreshPromise: Promise<void> | null = null;

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this.prisma) {
      return;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async doRefresh(): Promise<void> {
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

      // Conserva los reportes recién creados que todavía no aparecen en la BD.
      const now = Date.now();
      const recentMemory = this.reports.filter(
        (r) => now - new Date(r.generatedAt).getTime() < 10000,
      );
      const dbKeys = new Set(
        dbReports.map((r) => `${r.fileName}_${r.generatedAt}`),
      );
      const pendingRecent = recentMemory.filter(
        (r) => !dbKeys.has(`${r.fileName}_${r.generatedAt}`),
      );

      this.reports = [...pendingRecent, ...dbReports];
    } catch (error) {
      this.logger.error('Error al sincronizar el historial de reportes', error);
    }
  }

  findAll(): readonly GeneratedReport[] {
    void this.refresh();
    return this.reports;
  }

  create(report: GeneratedReport): GeneratedReport {
    this.reports.unshift(report);

    const prisma = this.prisma;

    if (prisma) {
      void (async () => {
        try {
          // TODO: registrar al administrador autenticado en vez del primer usuario de la BD.
          const user = await prisma.user.findFirst();
          if (user) {
            await prisma.adminExportHistory.upsert({
              where: {
                userId_createdAt: {
                  userId: user.id,
                  createdAt: new Date(report.generatedAt),
                },
              },
              update: {
                reportName: report.fileName,
                reportType: report.reportType,
              },
              create: {
                userId: user.id,
                reportName: report.fileName,
                reportType: report.reportType,
                createdAt: new Date(report.generatedAt),
              },
            });
          }
        } catch (error) {
          this.logger.error('Error al guardar el reporte generado', error);
        }
      })();
    }

    return report;
  }
}
