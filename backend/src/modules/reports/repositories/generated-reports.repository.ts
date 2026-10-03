import { Injectable } from '@nestjs/common';
import { GENERATED_REPORTS_MOCK } from '../mocks/generated-reports.mock.js';
import type { GeneratedReport } from '../types/generated-report.types.js';

// TEMPORAL: lee datos de prueba, no reportes reales.
// Se reemplazará por consultas Prisma cuando exista la tabla en la BD.
@Injectable()
export class GeneratedReportsRepository {
  findAll(): readonly GeneratedReport[] {
    return GENERATED_REPORTS_MOCK;
  }
}
