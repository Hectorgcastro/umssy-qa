import { z } from 'zod';
import type { PaginatedResult } from '../types/api-response.types.js';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Base de paginación para extender en los esquemas de cada módulo.
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export function paginate<T>(
  items: readonly T[],
  page: number,
  limit: number,
): PaginatedResult<T> {
  const start = (page - 1) * limit;

  // Los totales se calculan sobre `items`, que ya viene filtrado: con 10 registros
  // y límite 10 hay una sola página, y sin registros hay 0 páginas.
  return {
    items: items.slice(start, start + limit),
    totalItems: items.length,
    totalPages: Math.ceil(items.length / limit),
    page,
    limit,
  };
}
