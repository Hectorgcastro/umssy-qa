import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      // Construir mensaje legible en español a partir de los errores de Zod
      const detail = result.error.issues
        .map((issue) => `${issue.path.join('.') || 'valor'}: ${issue.message}`)
        .join('; ');
      throw new BadRequestException(detail);
    }
    return result.data;
  }
}