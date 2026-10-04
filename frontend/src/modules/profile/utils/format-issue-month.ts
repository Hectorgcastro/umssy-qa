import { SHORT_MONTH_LABELS } from "../config/short-month-labels.config";

export function formatIssueMonth(isoDate: string): string {
  const [year, month] = isoDate.split("-");
  const monthLabel = SHORT_MONTH_LABELS[Number(month) - 1];
  return monthLabel ? `${monthLabel} ${year}` : isoDate;
}
