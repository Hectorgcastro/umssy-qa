import { GeneratedReportsRepository } from '../repositories/generated-reports.repository.js';
import { reportHistoryQuerySchema } from '../requests/report-history.schema.js';
import { ReportHistoryService } from '../services/report-history.service.js';
import type { GeneratedReport } from '../types/generated-report.types.js';

function buildReport(overrides: Partial<GeneratedReport>): GeneratedReport {
  return {
    id: 'report-1',
    fileName: 'Reporte_De_Prueba',
    reportType: 'REGISTERED_USERS',
    generatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const REPORTS: GeneratedReport[] = [
  buildReport({ id: 'a', generatedAt: '2026-03-01T10:00:00.000Z' }),
  buildReport({
    id: 'b',
    reportType: 'REJECTED_USERS',
    generatedAt: '2026-05-01T10:00:00.000Z',
  }),
  buildReport({
    id: 'c',
    reportType: 'GRADUATES',
    generatedAt: '2025-02-01T10:00:00.000Z',
  }),
];

function buildService(
  reports: readonly GeneratedReport[] = REPORTS,
): ReportHistoryService {
  const repository = new GeneratedReportsRepository();
  vi.spyOn(repository, 'findAll').mockReturnValue(reports);
  return new ReportHistoryService(repository);
}

const historyQuery = (input: Record<string, unknown> = {}) =>
  reportHistoryQuerySchema.parse(input);

describe('ReportHistoryService', () => {
  it('devuelve los reportes del más reciente al más antiguo', () => {
    const result = buildService().getReportHistory(historyQuery());

    expect(result.items.map((report) => report.id)).toEqual(['b', 'a', 'c']);
    expect(result).toMatchObject({ totalItems: 3, page: 1, limit: 10 });
  });

  it('expone el nombre, el tipo y la fecha de generación de cada reporte', () => {
    const [report] = buildService().getReportHistory(historyQuery()).items;

    expect(report).toEqual({
      id: 'b',
      fileName: 'Reporte_De_Prueba',
      reportType: 'REJECTED_USERS',
      generatedAt: '2026-05-01T10:00:00.000Z',
    });
  });

  it('no modifica el orden de los datos del repositorio', () => {
    const reports = [...REPORTS];

    buildService(reports).getReportHistory(historyQuery());

    expect(reports.map((report) => report.id)).toEqual(['a', 'b', 'c']);
  });

  it('pagina los resultados', () => {
    const result = buildService().getReportHistory(
      historyQuery({ page: '2', limit: '2' }),
    );

    expect(result.items.map((report) => report.id)).toEqual(['c']);
    expect(result).toMatchObject({ totalItems: 3, page: 2, limit: 2 });
  });

  it('devuelve una lista vacía cuando no hay reportes', () => {
    const result = buildService([]).getReportHistory(historyQuery());

    expect(result).toEqual({ items: [], totalItems: 0, page: 1, limit: 10 });
  });

  it('usa los datos de prueba del repositorio por defecto', () => {
    const service = new ReportHistoryService(new GeneratedReportsRepository());

    const result = service.getReportHistory(historyQuery());

    expect(result.totalItems).toBe(12);
    expect(result.items[0].fileName).toBe('Lista_Usuarios_Activos_2026');
  });
});
