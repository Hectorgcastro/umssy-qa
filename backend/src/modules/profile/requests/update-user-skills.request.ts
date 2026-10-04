import { z } from 'zod';
import { MAX_USER_SKILLS } from '../constants/profile.constants.js';

export const updateUserSkillsSchema = z.object({
  skillIds: z.array(z.uuid()).max(MAX_USER_SKILLS),
});

export type UpdateUserSkillsRequest = z.infer<typeof updateUserSkillsSchema>;
