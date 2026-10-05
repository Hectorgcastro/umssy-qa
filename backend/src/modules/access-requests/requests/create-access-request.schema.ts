import { z } from 'zod';
import { ENTRY_YEAR_COHERENCE_MESSAGE, accessRequestFields, hasEntryYearConflict } from './access-request-fields.js';

export const createAccessRequestSchema = z.object(accessRequestFields).superRefine((data, ctx) => {
  if (hasEntryYearConflict(data)) {
    ctx.addIssue({ code: 'custom', path: ['entryYear'], message: ENTRY_YEAR_COHERENCE_MESSAGE });
  }
});

export type CreateAccessRequestDto = z.infer<typeof createAccessRequestSchema>;
