// Primera gestión que acepta el backend para los reportes.
export const FIRST_ACADEMIC_YEAR = 2020;

const FIRST_SEMESTER_LAST_MONTH = 6;

// Gestiones desde la actual hacia atrás: "2-2026", "1-2026", "2-2025"...
// "1-AAAA" va de enero a junio y "2-AAAA" de julio a diciembre.
export function getAcademicPeriods(today = new Date(), firstYear = FIRST_ACADEMIC_YEAR): string[] {
  const currentYear = today.getFullYear();
  const currentSemester = today.getMonth() + 1 <= FIRST_SEMESTER_LAST_MONTH ? 1 : 2;
  const periods: string[] = [];

  for (let year = currentYear; year >= firstYear; year--) {
    if (year < currentYear || currentSemester === 2) {
      periods.push(`2-${year}`);
    }
    periods.push(`1-${year}`);
  }

  return periods;
}
