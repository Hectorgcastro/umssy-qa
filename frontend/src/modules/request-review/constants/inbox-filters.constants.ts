import type { InboxPeriod } from "../types/inbox-filters.types";

export const SEARCH_DEBOUNCE_MS = 300;
// El backend rechaza búsquedas de menos de 2 caracteres
export const MIN_SEARCH_LENGTH = 2;

export const ALL_CAREERS_VALUE = "all";
// Espejo del catálogo careers del backend; el valor viaja tal cual en el parámetro career
export const CAREER_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: ALL_CAREERS_VALUE, label: "Todas las carreras" },
  { value: "Licenciatura en Ingeniería de Sistemas", label: "Licenciatura en Ingeniería de Sistemas" },
  { value: "Licenciatura Ingeniería en Informática", label: "Licenciatura Ingeniería en Informática" },
];

export const DEFAULT_PERIOD: InboxPeriod = "all";
export const PERIOD_OPTIONS: ReadonlyArray<{ value: InboxPeriod; label: string }> = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "all", label: "Todo el período" },
];
