import type { BreadcrumbItem } from "@/shared/types/breadcrumb.types";
import type { SelectOption } from "@/shared/types/select-option.types";

export const REGISTERED_USERS_BREADCRUMB: BreadcrumbItem[] = [
  { label: "Inicio", href: "/admin" },
  { label: "Reportes Analíticos" },
  { label: "Reporte de usuarios registrados" },
];

export const USER_TYPE_OPTIONS: SelectOption[] = [
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
