const REPORT_DATE_FORMATTER = new Intl.DateTimeFormat("es-BO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

// Muestra la fecha como dd/mm/aaaa, igual que en el diseño.
export function formatReportDate(isoDate: string): string {
  return REPORT_DATE_FORMATTER.format(new Date(isoDate));
}
