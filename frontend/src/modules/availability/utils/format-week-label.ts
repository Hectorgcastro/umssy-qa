import type { WeekRange } from "@/shared/types/week-range.types";
import { toBoliviaTime } from "@/shared/utils/date-time";
import { MONTH_LABELS } from "../constants/my-availability.constants";

export function formatWeekLabel(weekRange: WeekRange): string {
  const start = toBoliviaTime(weekRange.startAt);
  const end = toBoliviaTime(weekRange.endAt);
  const startLabel = `${start.day} ${MONTH_LABELS[start.month - 1]}`;
  const endLabel = `${end.day} ${MONTH_LABELS[end.month - 1]} ${end.year}`;

  return start.year === end.year
    ? `${startLabel} - ${endLabel}`
    : `${startLabel} ${start.year} - ${endLabel}`;
}
