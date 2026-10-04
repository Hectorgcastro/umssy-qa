import { Injectable } from '@nestjs/common';
import type { GeneratedReport } from '../types/generated-report.types.js';

// TEMPORAL: guarda los reportes en memoria, sin datos iniciales.
// Los registros nuevos se pierden al reiniciar el servidor.
// Se reemplazará por consultas Prisma cuando exista la tabla en la BD.
@Injectable()
export class GeneratedReportsRepository {
  private readonly reports: GeneratedReport[] = [];

  findAll(): readonly GeneratedReport[] {
    return this.reports;
  }

  create(report: GeneratedReport): GeneratedReport {
    this.reports.push(report);
    return report;
  }
}
