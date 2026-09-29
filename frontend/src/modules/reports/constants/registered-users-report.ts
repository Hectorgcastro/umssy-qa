import type { BreadcrumbItem } from "@/shared/types/breadcrumb.types";

export const REGISTERED_USERS_BREADCRUMB: BreadcrumbItem[] = [
  { label: "Inicio", href: "/admin" },
  { label: "Reportes Analíticos" },
  { label: "Reporte de usuarios registrados" },
];

export const USER_TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "graduate", label: "Titulado" },
  { value: "alumni", label: "Egresado" },
  { value: "company", label: "Empresa" },
  { value: "admin", label: "Administrador" },
];

export const REGISTERED_USERS_COLUMNS = [
  "Usuario",
  "Correo",
  "Tipo de Usuario",
  "Identificador",
  "Documento",
  "Fecha de Registro",
];
