import { z } from 'zod';

import {
  CERTIFICATION_NAME_MAX_LENGTH,
  CERTIFICATION_VALIDATION_MESSAGES,
  ISO_DATE_PATTERN,
  ISSUING_ORGANIZATION_MAX_LENGTH,
} from '../constants/certification.constants.js';

const requiredText = () =>
  z
    .string({ error: CERTIFICATION_VALIDATION_MESSAGES.required })
    .trim()
    .min(1, CERTIFICATION_VALIDATION_MESSAGES.required);

function isCalendarDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export const certificationNameSchema = requiredText().max(
  CERTIFICATION_NAME_MAX_LENGTH,
  CERTIFICATION_VALIDATION_MESSAGES.nameTooLong,
);

export const issuingOrganizationSchema = requiredText().max(
  ISSUING_ORGANIZATION_MAX_LENGTH,
  CERTIFICATION_VALIDATION_MESSAGES.organizationTooLong,
);

export const issueDateSchema = z
  .string({ error: CERTIFICATION_VALIDATION_MESSAGES.required })
  .trim()
  .min(1, { error: CERTIFICATION_VALIDATION_MESSAGES.required, abort: true })
  .refine(isCalendarDate, {
    error: CERTIFICATION_VALIDATION_MESSAGES.invalidDate,
    abort: true,
  })
  .transform((value) => new Date(`${value}T00:00:00.000Z`))
  .refine((date) => date.getTime() <= Date.now(), {
    message: CERTIFICATION_VALIDATION_MESSAGES.futureDate,
  });
