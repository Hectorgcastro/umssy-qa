import type { SelectOption } from "@/shared/types/select-option.types";

// Primera gestión disponible en los reportes. Se reemplazará por los datos del backend.
export const FIRST_MANAGEMENT_YEAR = 2020;

export function buildManagementYearOptions(currentYear: number): SelectOption[] {
  const options: SelectOption[] = [];

  for (let year = currentYear; year >= FIRST_MANAGEMENT_YEAR; year--) {
    options.push({ value: String(year), label: String(year) });
  }

  return options;
}
