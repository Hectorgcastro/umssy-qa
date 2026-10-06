import type { EmploymentPeriod } from '../types/employment-period.types.js';

export function experienceYears(periods: EmploymentPeriod[], now = new Date()): number {
  const ranges = periods.map(({ startDate, endDate, isCurrent }) => [startDate.getTime(), Math.min((isCurrent ? now : endDate ?? startDate).getTime(), now.getTime())] as const)
    .filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end) && end > start)
    .sort(([left], [right]) => left - right);
  let total = 0;
  let previousEnd = -Infinity;
  for (const [start, end] of ranges) {
    total += Math.max(0, end - Math.max(start, previousEnd));
    previousEnd = Math.max(previousEnd, end);
  }
  return total / (365.25 * 24 * 60 * 60 * 1000);
}
