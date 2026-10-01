import type { BreadcrumbItem } from "@/shared/types/breadcrumb.types";
import type { SelectOption } from "@/shared/types/select-option.types";

export const REGISTERED_USERS_BREADCRUMB: BreadcrumbItem[] = [
  { label: "Inicio", href: "/admin" },
  { label: "Reportes Analíticos" },
  { label: "Reporte de usuarios registrados" },
];

export const USER_TYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "student", label: "Estudiante" },
  { value: "graduate", label: "Titulado" },
  { value: "company", label: "Empresa" },
  { value: "admin", label: "Administrador" },
];
