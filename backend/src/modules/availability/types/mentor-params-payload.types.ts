import type { z } from 'zod';
import type { mentorParamsSchema } from '../requests/mentor-params.request.js';

export type MentorParamsPayload = z.infer<typeof mentorParamsSchema>;
