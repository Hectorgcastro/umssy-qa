import type { AcademicPeriod } from "../types/registered-user.types";

// Primera gestión que acepta el backend para los reportes.
export const FIRST_ACADEMIC_YEAR = 2020;

const FIRST_SEMESTER_LAST_MONTH = 6;

// La gestión actual se calcula en hora de Bolivia, igual que en el backend.
const YEAR_MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/La_Paz",
  year: "numeric",
  month: "numeric",
});

// Gestiones desde la actual hacia atrás: "II-2026", "I-2026", "II-2025"...
// "I-AAAA" va de enero a junio y "II-AAAA" de julio a diciembre.
export function getAcademicPeriods(today = new Date(), firstYear = FIRST_ACADEMIC_YEAR): AcademicPeriod[] {
  const parts = YEAR_MONTH_FORMATTER.formatToParts(today);
  const currentYear = Number(parts.find((part) => part.type === "year")?.value);
  const currentMonth = Number(parts.find((part) => part.type === "month")?.value);
  const isSecondSemester = currentMonth > FIRST_SEMESTER_LAST_MONTH;
  const periods: AcademicPeriod[] = [];

  for (let year = currentYear; year >= firstYear; year--) {
    if (year < currentYear || isSecondSemester) {
      periods.push(`II-${year}`);
    }
    periods.push(`I-${year}`);
  }

  return periods;
}
