import { z } from 'zod';
import { EDUCATION_DESCRIPTION_MAX_LENGTH } from '../constants/education-validation.constants.js';

export const educationIdSchema = z.uuid();
export const institutionSchema = z.string().trim().min(1);
export const degreeSchema = z.string().trim().min(1);
export const educationDateSchema = z.iso
  .date()
  .transform((value) => new Date(value));
export const educationDescriptionSchema = z
  .string()
  .max(EDUCATION_DESCRIPTION_MAX_LENGTH)
  .trim()
  .nullable()
  .optional();
