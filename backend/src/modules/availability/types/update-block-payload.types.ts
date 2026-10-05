import type { z } from 'zod';
import type { updateBlockSchema } from '../requests/update-block.request.js';

export type UpdateBlockPayload = z.infer<typeof updateBlockSchema>;
