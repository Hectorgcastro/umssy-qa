import { z } from 'zod';

export const MAX_REJECTION_REASON_LENGTH = 500;

// El motivo es obligatorio: no puede quedar vacío ni solo con espacios
export const rejectAccessRequestSchema = z.object({
  reason: z
    .string({ error: 'El motivo del rechazo es obligatorio' })
    .trim()
    .min(1, 'El motivo del rechazo es obligatorio')
    .max(MAX_REJECTION_REASON_LENGTH, `El motivo no puede superar los ${MAX_REJECTION_REASON_LENGTH} caracteres`),
});

export type RejectAccessRequestDto = z.infer<typeof rejectAccessRequestSchema>;
