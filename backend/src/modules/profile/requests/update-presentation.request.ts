import { z } from 'zod';
import { aboutMeSchema, headlineSchema } from './profile-fields.schema.js';

// interestedOpportunities is added when the users.interested_opportunities column exists.
export const updatePresentationSchema = z.object({
  headline: headlineSchema,
  aboutMe: aboutMeSchema,
});

export type UpdatePresentationRequest = z.infer<typeof updatePresentationSchema>;
