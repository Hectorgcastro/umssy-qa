import { z } from 'zod';
import { buildCreateBlockSchema } from './create-block.request.js';

export const updateBlockSchema = buildCreateBlockSchema();

export type UpdateBlockPayload = z.infer<typeof updateBlockSchema>;
