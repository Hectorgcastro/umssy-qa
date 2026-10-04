import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CERTIFICATION_VALIDATION_MESSAGES } from "../config/certification-validation.config";
import type { CreateCertificationDto } from "../types/certification.types";
import { getTodayIsoDate, validateCertification } from "./validate-certification";

const VALID_VALUES: CreateCertificationDto = {
  name: "AWS Certified Cloud Practitioner",
  issuingOrganization: "Amazon Web Services",
  issueDate: "2025-03-10",
};

describe("validateCertification", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 5, 15, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns no errors for valid values", () => {
    expect(validateCertification(VALID_VALUES)).toEqual({});
  });

  it("requires every field", () => {
    expect(
      validateCertification({ name: "", issuingOrganization: "", issueDate: "" }),
    ).toEqual({
      name: CERTIFICATION_VALIDATION_MESSAGES.required,
      issuingOrganization: CERTIFICATION_VALIDATION_MESSAGES.required,
      issueDate: CERTIFICATION_VALIDATION_MESSAGES.required,
    });
  });

  it("accepts a name of 150 characters and rejects a longer one", () => {
    expect(validateCertification({ ...VALID_VALUES, name: "a".repeat(150) })).toEqual({});
    expect(validateCertification({ ...VALID_VALUES, name: "a".repeat(151) })).toEqual({
      name: CERTIFICATION_VALIDATION_MESSAGES.nameTooLong,
    });
  });

  it("accepts an organization of 100 characters and rejects a longer one", () => {
    expect(
      validateCertification({ ...VALID_VALUES, issuingOrganization: "a".repeat(100) }),
    ).toEqual({});
    expect(
      validateCertification({ ...VALID_VALUES, issuingOrganization: "a".repeat(101) }),
    ).toEqual({ issuingOrganization: CERTIFICATION_VALIDATION_MESSAGES.organizationTooLong });
  });

  it.each(["10/03/2025", "2025-13-01", "2025-02-30", "not-a-date"])(
    "rejects the invalid date %s",
    (issueDate) => {
      expect(validateCertification({ ...VALID_VALUES, issueDate })).toEqual({
        issueDate: CERTIFICATION_VALIDATION_MESSAGES.invalidDate,
      });
    },
  );

  it("accepts today as the issue date", () => {
    expect(validateCertification({ ...VALID_VALUES, issueDate: "2026-06-15" })).toEqual({});
  });

  it("rejects a future issue date", () => {
    expect(validateCertification({ ...VALID_VALUES, issueDate: "2026-06-16" })).toEqual({
      issueDate: CERTIFICATION_VALIDATION_MESSAGES.futureDate,
    });
  });
});

describe("getTodayIsoDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats the local date as yyyy-mm-dd", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 0, 5, 9));

    expect(getTodayIsoDate()).toBe("2026-01-05");
  });
});
