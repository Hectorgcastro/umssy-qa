import { z } from 'zod';
import { GRADUATION_YEAR_COHERENCE_MESSAGE, accessRequestFields, hasGraduationYearConflict } from './access-request-fields.js';

export const createAccessRequestSchema = z.object(accessRequestFields).superRefine((data, ctx) => {
  if (hasGraduationYearConflict(data)) {
    ctx.addIssue({ code: 'custom', path: ['graduationYear'], message: GRADUATION_YEAR_COHERENCE_MESSAGE });
  }
});

export type CreateAccessRequestDto = z.infer<typeof createAccessRequestSchema>;
