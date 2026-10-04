import { EDUCATION_FEEDBACK_MESSAGES } from "../config/education-feedback.config";
import { SHORT_MONTH_LABELS } from "../config/short-month-labels.config";

function formatEducationDate(date: string): string {
  const [year, month] = date.split("-");
  const label = SHORT_MONTH_LABELS[Number(month) - 1];
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${year}`;
}

export function formatEducationPeriod(startDate: string, endDate: string | null): string {
  const start = formatEducationDate(startDate);
  const end = endDate
    ? formatEducationDate(endDate)
    : EDUCATION_FEEDBACK_MESSAGES.missingEndDate;
  return `${start} – ${end}`;
}
