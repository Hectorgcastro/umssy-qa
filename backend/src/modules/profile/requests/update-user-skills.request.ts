import { z } from 'zod';

export const MAX_USER_SKILLS = 50;

export const updateUserSkillsSchema = z.object({
  skillIds: z.array(z.uuid()).max(MAX_USER_SKILLS),
});

export type UpdateUserSkillsRequest = z.infer<typeof updateUserSkillsSchema>;
