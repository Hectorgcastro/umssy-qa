import { BadRequestException, type PipeTransform } from '@nestjs/common';
import { z } from 'zod';

// Mensajes de validación de Zod en español para toda la API.
z.config(z.locales.es());

export class ZodValidationPipe<
  TSchema extends z.ZodType,
> implements PipeTransform<unknown, z.infer<TSchema>> {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown): z.infer<TSchema> {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const detail = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      throw new BadRequestException(detail);
    }

    return result.data;
  }
}
