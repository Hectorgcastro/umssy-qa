import type { z } from 'zod';
import type { createBlockSchema } from '../requests/create-block.request.js';

export type CreateBlockPayload = z.infer<typeof createBlockSchema>;
