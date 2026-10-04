import { z } from 'zod';
import { DELETE_BLOCK_MESSAGES } from '../constants/delete-block.constants.js';

export const blockIdSchema = z.uuid({ error: DELETE_BLOCK_MESSAGES.invalidId });
