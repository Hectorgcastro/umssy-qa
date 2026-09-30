import type { BreadcrumbItem } from "@/shared/types/breadcrumb.types";

export const REJECTED_USERS_BREADCRUMB: BreadcrumbItem[] = [
  { label: "Inicio", href: "/admin" },
  { label: "Reportes Analíticos" },
  { label: "Reporte de usuarios rechazados" },
];

export const REJECTED_USERS_COLUMNS = [
  "Usuario",
  "Correo",
  "Identificador",
  "Documento",
  "Fecha de Registro",
];
