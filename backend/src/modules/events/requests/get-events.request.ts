import { z } from 'zod';

export const MAX_PAGE_SIZE = 50;

export const GetEventsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(10),
  categoryId: z.string().uuid({ message: 'categoryId debe ser un UUID válido' }).optional(),
  statusId: z.string().uuid({ message: 'statusId debe ser un UUID válido' }).optional(),
  from: z
    .string()
    .refine(
      (val) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
        const d = new Date(val);
        return !isNaN(d.getTime()) && d.toISOString().startsWith(val);
      },
      { message: 'from debe ser una fecha válida en formato YYYY-MM-DD' },
    )
    .optional(),
  to: z
    .string()
    .refine(
      (val) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
        const d = new Date(val);
        return !isNaN(d.getTime()) && d.toISOString().startsWith(val);
      },
      { message: 'to debe ser una fecha válida en formato YYYY-MM-DD' },
    )
    .optional(),
});

export type GetEventsPayload = z.infer<typeof GetEventsSchema>;
