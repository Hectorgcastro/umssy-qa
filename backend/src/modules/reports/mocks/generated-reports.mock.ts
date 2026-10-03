import type { GeneratedReport } from '../types/generated-report.types.js';

// TEMPORAL: datos de prueba, no son reportes reales ni registros de PostgreSQL.
// Son los mismos que usaba el mock del frontend (fechas en UTC, equivalentes a la hora de Bolivia).
// Se eliminarán cuando DevOps agregue a la BD la tabla de reportes generados
// y la exportación de reportes registre cada archivo generado.
export const GENERATED_REPORTS_MOCK: readonly GeneratedReport[] = [
  {
    id: 'report-001',
    fileName: 'Lista_Usuarios_Activos_2026',
    reportType: 'REGISTERED_USERS',
    generatedAt: '2026-09-28T23:45:00.000Z',
  },
  {
    id: 'report-002',
    fileName: 'Reporte_Egresados_Registrados',
    reportType: 'GRADUATES',
    generatedAt: '2026-09-27T20:32:00.000Z',
  },
  {
    id: 'report-003',
    fileName: 'Usuarios_Rechazados_Septiembre',
    reportType: 'REJECTED_USERS',
    generatedAt: '2026-09-26T15:20:00.000Z',
  },
  {
    id: 'report-004',
    fileName: 'Egresados_Con_Titulo_2026',
    reportType: 'GRADUATES',
    generatedAt: '2026-09-25T19:17:00.000Z',
  },
  {
    id: 'report-005',
    fileName: 'Lista_Usuarios_Inactivos_2026',
    reportType: 'REGISTERED_USERS',
    generatedAt: '2026-09-24T14:43:00.000Z',
  },
  {
    id: 'report-006',
    fileName: 'Reporte_Egresados_0126',
    reportType: 'GRADUATES',
    generatedAt: '2026-09-23T18:08:00.000Z',
  },
  {
    id: 'report-007',
    fileName: 'Usuarios_Con_Correo_Valido',
    reportType: 'REGISTERED_USERS',
    generatedAt: '2026-09-22T13:56:00.000Z',
  },
  {
    id: 'report-008',
    fileName: 'Rechazados_Agosto_2026',
    reportType: 'REJECTED_USERS',
    generatedAt: '2026-09-21T21:32:00.000Z',
  },
  {
    id: 'report-009',
    fileName: 'Egresados_Por_Area',
    reportType: 'GRADUATES',
    generatedAt: '2026-09-20T16:18:00.000Z',
  },
  {
    id: 'report-010',
    fileName: 'Lista_Usuarios_2026',
    reportType: 'REGISTERED_USERS',
    generatedAt: '2026-09-19T13:27:00.000Z',
  },
  {
    id: 'report-011',
    fileName: 'Rechazados_Julio_2026',
    reportType: 'REJECTED_USERS',
    generatedAt: '2026-09-18T12:40:00.000Z',
  },
  {
    id: 'report-012',
    fileName: 'Egresados_Gestion_2025',
    reportType: 'GRADUATES',
    generatedAt: '2026-09-17T22:05:00.000Z',
  },
];
