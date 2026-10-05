import { z } from 'zod';
import { ENTRY_YEAR_COHERENCE_MESSAGE, accessRequestFields, hasEntryYearConflict } from './access-request-fields.js';

// phone acepta null para borrar el teléfono guardado
// Si solo llega uno de los dos campos, la coherencia con el valor guardado la valida el service
export const updateAccessRequestSchema = z
  .object({ ...accessRequestFields, phone: accessRequestFields.phone.nullable() })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo para actualizar')
  .superRefine((data, ctx) => {
    if (hasEntryYearConflict(data)) {
      ctx.addIssue({ code: 'custom', path: ['entryYear'], message: ENTRY_YEAR_COHERENCE_MESSAGE });
    }
  });

export type UpdateAccessRequestDto = z.infer<typeof updateAccessRequestSchema>;
