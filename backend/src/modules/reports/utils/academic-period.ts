// Gestión académica semestral: "I-2025" va de enero a junio y "II-2025" de julio a diciembre.
export const ACADEMIC_PERIOD_PATTERN = /^(I|II)-\d{4}$/;

const FIRST_SEMESTER_LAST_MONTH = 6;

// La gestión se calcula en hora de Bolivia, igual que las fechas del reporte.
const YEAR_MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/La_Paz',
  year: 'numeric',
  month: 'numeric',
});

export function getAcademicPeriodYear(period: string): number {
  return Number(period.split('-')[1]);
}

// Devuelve la gestión a la que pertenece una fecha ISO, o undefined si no es válida.
export function getAcademicPeriod(isoDate: string): string | undefined {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const parts = YEAR_MONTH_FORMATTER.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const semester = month <= FIRST_SEMESTER_LAST_MONTH ? 'I' : 'II';

  return `${semester}-${year}`;
}
