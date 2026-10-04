import type { z } from 'zod';
import type { weekQuerySchema } from '../requests/week-query.request.js';

export type WeekQueryPayload = z.infer<typeof weekQuerySchema>;
