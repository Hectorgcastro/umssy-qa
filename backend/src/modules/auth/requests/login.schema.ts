import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  roleTag: z.enum(['titulado', 'estudiante', 'mentor', 'empresa', 'administrativo']),
});

export type LoginDto = z.infer<typeof loginSchema>;