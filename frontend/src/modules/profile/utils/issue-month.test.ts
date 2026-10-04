import { describe, expect, it } from "vitest";
import { formatIssueMonth } from "./format-issue-month";
import { getFileFormat } from "./get-file-format";
import { isoDateToMonth } from "./iso-date-to-month";
import { monthToIsoDate } from "./month-to-iso-date";

describe("issue month helpers", () => {
  it("converts a month to the first day of that month", () => {
    expect(monthToIsoDate("2025-03")).toBe("2025-03-01");
  });

  it("leaves values that are not a month untouched", () => {
    expect(monthToIsoDate("")).toBe("");
    expect(monthToIsoDate("2025-03-15")).toBe("2025-03-15");
    expect(monthToIsoDate("marzo 2025")).toBe("marzo 2025");
  });

  it("extracts the month from an iso date", () => {
    expect(isoDateToMonth("2025-03-15")).toBe("2025-03");
  });

  it("returns an empty month when there is no date", () => {
    expect(isoDateToMonth(undefined)).toBe("");
    expect(isoDateToMonth(null)).toBe("");
  });

  it("formats the month and year of an iso date", () => {
    expect(formatIssueMonth("2025-03-07")).toBe("mar 2025");
  });

  it("returns the original value when the month is invalid", () => {
    expect(formatIssueMonth("invalid")).toBe("invalid");
  });

  it("detects the document format from the file name", () => {
    expect(getFileFormat("scrum.PDF")).toBe("PDF");
    expect(getFileFormat("photo.jpeg")).toBe("JPG");
    expect(getFileFormat("photo.png")).toBe("PNG");
  });

  it("uppercases an unknown extension and handles names without one", () => {
    expect(getFileFormat("notes.txt")).toBe("TXT");
    expect(getFileFormat("")).toBe("");
  });
});
