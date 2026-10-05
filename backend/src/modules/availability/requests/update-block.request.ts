import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { buildCreateBlockSchema } from './create-block.request.js';

export const updateBlockSchema = buildCreateBlockSchema();

export type UpdateBlockPayload = z.infer<typeof updateBlockSchema>;

export class UpdateBlockDto extends createZodDto(updateBlockSchema) {}
