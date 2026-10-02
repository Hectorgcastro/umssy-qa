import { SHORT_MONTH_LABELS } from "../config/short-month-labels.config";

// Formats a date in local time, for example "20 sep 2026".
export function formatUploadDate(date: Date): string {
  return `${date.getDate()} ${SHORT_MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}
