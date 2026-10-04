import { ISSUE_MONTH_DAY_SUFFIX, ISSUE_MONTH_PATTERN } from "../constants/certification-form.constants";

export function monthToIsoDate(value: string): string {
  return ISSUE_MONTH_PATTERN.test(value) ? `${value}${ISSUE_MONTH_DAY_SUFFIX}` : value;
}
