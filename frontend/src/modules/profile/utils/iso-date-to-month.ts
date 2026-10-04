import { ISSUE_MONTH_LENGTH } from "../constants/certification-form.constants";

export function isoDateToMonth(isoDate: string | null | undefined): string {
  return (isoDate ?? "").slice(0, ISSUE_MONTH_LENGTH);
}
