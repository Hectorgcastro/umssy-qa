import {
  CERTIFICATION_NAME_MAX_LENGTH,
  CERTIFICATION_VALIDATION_MESSAGES,
  ISSUING_ORGANIZATION_MAX_LENGTH,
} from "../config/certification-validation.config";
import type { CertificationErrors } from "../types/certification-errors.types";
import type { CreateCertificationDto } from "../types/create-certification-dto.types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function getTodayIsoDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export function validateCertification(values: CreateCertificationDto): CertificationErrors {
  const errors: CertificationErrors = {};

  if (!values.name) {
    errors.name = CERTIFICATION_VALIDATION_MESSAGES.required;
  } else if (values.name.length > CERTIFICATION_NAME_MAX_LENGTH) {
    errors.name = CERTIFICATION_VALIDATION_MESSAGES.nameTooLong;
  }

  if (!values.issuingOrganization) {
    errors.issuingOrganization = CERTIFICATION_VALIDATION_MESSAGES.required;
  } else if (values.issuingOrganization.length > ISSUING_ORGANIZATION_MAX_LENGTH) {
    errors.issuingOrganization = CERTIFICATION_VALIDATION_MESSAGES.organizationTooLong;
  }

  if (!values.issueDate) {
    errors.issueDate = CERTIFICATION_VALIDATION_MESSAGES.required;
  } else if (!isValidIsoDate(values.issueDate)) {
    errors.issueDate = CERTIFICATION_VALIDATION_MESSAGES.invalidDate;
  } else if (values.issueDate > getTodayIsoDate()) {
    errors.issueDate = CERTIFICATION_VALIDATION_MESSAGES.futureDate;
  }

  return errors;
}
