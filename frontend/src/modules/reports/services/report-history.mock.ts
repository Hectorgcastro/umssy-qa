import type { GeneratedReport } from "../types/generated-report.types";

// Datos simulados mientras el endpoint del backend no esté disponible (sección 1.6 del manual).
export const REPORT_HISTORY_MOCK: GeneratedReport[] = [
  { id: "1", fileName: "Lista_Usuarios_Activos_2026", reportType: "REGISTERED_USERS", generatedAt: "2026-09-28T19:45:00" },
  { id: "2", fileName: "Reporte_Egresados_Registrados", reportType: "GRADUATES", generatedAt: "2026-09-27T16:32:00" },
  { id: "3", fileName: "Usuarios_Rechazados_Septiembre", reportType: "REJECTED_USERS", generatedAt: "2026-09-26T11:20:00" },
  { id: "4", fileName: "Egresados_Con_Titulo_2026", reportType: "GRADUATES", generatedAt: "2026-09-25T15:17:00" },
  { id: "5", fileName: "Lista_Usuarios_Inactivos_2026", reportType: "REGISTERED_USERS", generatedAt: "2026-09-24T10:43:00" },
  { id: "6", fileName: "Reporte_Egresados_0126", reportType: "GRADUATES", generatedAt: "2026-09-23T14:08:00" },
  { id: "7", fileName: "Usuarios_Con_Correo_Valido", reportType: "REGISTERED_USERS", generatedAt: "2026-09-22T09:56:00" },
  { id: "8", fileName: "Rechazados_Agosto_2026", reportType: "REJECTED_USERS", generatedAt: "2026-09-21T17:32:00" },
  { id: "9", fileName: "Egresados_Por_Area", reportType: "GRADUATES", generatedAt: "2026-09-20T12:18:00" },
  { id: "10", fileName: "Lista_Usuarios_2026", reportType: "REGISTERED_USERS", generatedAt: "2026-09-19T09:27:00" },
  { id: "11", fileName: "Rechazados_Julio_2026", reportType: "REJECTED_USERS", generatedAt: "2026-09-18T08:40:00" },
  { id: "12", fileName: "Egresados_Gestion_2025", reportType: "GRADUATES", generatedAt: "2026-09-17T18:05:00" },
];
