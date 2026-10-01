import { z } from 'zod';
import { paginationSchema } from '../../../common/utils/pagination.js';
import { REPORT_USER_TYPES } from '../types/report-user.types.js';

const FIRST_REPORT_YEAR = 2020;
const MAX_SEARCH_LENGTH = 100;

const searchSchema = z.string().trim().max(MAX_SEARCH_LENGTH).optional();

export const registeredUsersQuerySchema = paginationSchema.extend({
  userType: z.enum(['all', ...REPORT_USER_TYPES]).default('all'),
  year: z.coerce.number().int().min(FIRST_REPORT_YEAR).optional(),
  search: searchSchema,
});

export const rejectedUsersQuerySchema = paginationSchema.extend({
  search: searchSchema,
});

export type RegisteredUsersQuery = z.infer<typeof registeredUsersQuerySchema>;
export type RejectedUsersQuery = z.infer<typeof rejectedUsersQuerySchema>;
