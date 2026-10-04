import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(
    z.object({ page: z.coerce.number().int().min(1).default(1) }),
  );

  it('devuelve los datos validados y transformados', () => {
    expect(pipe.transform({ page: '3' })).toEqual({ page: 3 });
    expect(pipe.transform({})).toEqual({ page: 1 });
  });

  it('lanza 400 indicando el campo inválido', () => {
    expect(() => pipe.transform({ page: '0' })).toThrow(BadRequestException);

    try {
      pipe.transform({ page: '0' });
    } catch (error) {
      expect((error as BadRequestException).message).toContain('page:');
    }
  });

  it('valida cuerpos de petición como el del login', () => {
    const bodyPipe = new ZodValidationPipe(z.object({ name: z.string().min(1) }));

    expect(bodyPipe.transform({ name: 'Derek' })).toEqual({ name: 'Derek' });
    expect(() => bodyPipe.transform({ name: '' })).toThrow(BadRequestException);
  });
});
