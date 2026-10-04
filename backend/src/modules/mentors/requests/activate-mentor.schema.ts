import { z } from 'zod';

export const activateMentorSchema = z.object({
  technicalAreaIds: z.array(z.string().uuid()).min(1),
  orientationTypeIds: z.array(z.string().uuid()).min(1),
});

export type ActivateMentorDto = z.infer<typeof activateMentorSchema>;