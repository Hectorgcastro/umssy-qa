import { z } from 'zod';
import { ACCESS_REQUEST_STATUS } from '../types/access-request.enum.js';

export const LIST_STATUSES = [
  ACCESS_REQUEST_STATUS.PENDING,
  ACCESS_REQUEST_STATUS.IN_REVIEW,
  ACCESS_REQUEST_STATUS.APPROVED,
  ACCESS_REQUEST_STATUS.REJECTED,
] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Los borradores nunca se listan: el filtro solo acepta los cuatro estados posteriores al envío
export const listAccessRequestsQuerySchema = z.object({
  status: z.enum(LIST_STATUSES, { error: 'El estado no es válido' }).optional(),
  page: z.coerce
    .number({ error: 'La página debe ser un número' })
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor o igual a 1')
    .default(1),
  limit: z.coerce
    .number({ error: 'El límite debe ser un número' })
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser mayor o igual a 1')
    .max(MAX_PAGE_SIZE, `El límite no puede superar ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
});

export type ListAccessRequestsQuery = z.infer<typeof listAccessRequestsQuerySchema>;
