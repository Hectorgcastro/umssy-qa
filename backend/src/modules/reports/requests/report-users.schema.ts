import { z } from 'zod';
import {
  DEFAULT_PAGE_SIZE,
  paginationSchema,
} from '../../../common/utils/pagination.js';
import { REPORT_USER_TYPES } from '../types/report-user.types.js';
import {
  ACADEMIC_PERIOD_PATTERN,
  getAcademicPeriodYear,
} from '../utils/academic-period.js';

const FIRST_REPORT_YEAR = 2020;
const MAX_SEARCH_LENGTH = 100;

const searchSchema = z.string().trim().max(MAX_SEARCH_LENGTH).optional();

const academicPeriodSchema = z
  .string()
  .trim()
  .regex(
    ACADEMIC_PERIOD_PATTERN,
    'La gestión debe tener el formato 1-2025 o 2-2025',
  )
  .refine(
    (period) => getAcademicPeriodYear(period) >= FIRST_REPORT_YEAR,
    `La gestión no puede ser anterior a ${FIRST_REPORT_YEAR}`,
  );

// Valor de la opción "Todos" del filtro: equivale a no enviar userType.
export const ALL_USER_TYPES = 'ALL';

// Sin userType (o con "ALL") se devuelven todos los tipos de usuario.
const userTypeSchema = z
  .enum([...REPORT_USER_TYPES, ALL_USER_TYPES])
  .transform((userType) => (userType === ALL_USER_TYPES ? undefined : userType))
  .optional();

export const registeredUsersFiltersSchema = z.object({
  userType: userTypeSchema,
  year: z.coerce.number().int().min(FIRST_REPORT_YEAR).optional(),
  period: academicPeriodSchema.optional(),
  search: searchSchema,
});

// El reporte de registrados se entrega en lotes de máximo 10 registros.
export const registeredUsersQuerySchema = paginationSchema.extend({
  ...registeredUsersFiltersSchema.shape,
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(DEFAULT_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

// En rechazados el buscador filtra solo por correo.
export const rejectedUsersFiltersSchema = z.object({
  search: searchSchema,
});

export const rejectedUsersQuerySchema = paginationSchema.extend(
  rejectedUsersFiltersSchema.shape,
);

export type RegisteredUsersFilters = z.infer<
  typeof registeredUsersFiltersSchema
>;
export type RegisteredUsersQuery = z.infer<typeof registeredUsersQuerySchema>;
export type RejectedUsersFilters = z.infer<typeof rejectedUsersFiltersSchema>;
export type RejectedUsersQuery = z.infer<typeof rejectedUsersQuerySchema>;
