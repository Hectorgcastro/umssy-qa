import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { RequestValidationException } from '../exceptions/request-validation.exception.js';
import { buildRequestValidationException } from '../utils/build-request-validation-exception.js';
import { toApiBody } from '../utils/to-api-body.js';

describe('buildRequestValidationException', () => {
  it('joins every issue with its path into a 400 domain exception', () => {
    const exception = buildRequestValidationException([
      { message: 'Required', path: ['firstName'] },
      { message: 'Invalid email', path: [{ key: 'contact' }, 'email'] },
    ]);

    expect(exception).toBeInstanceOf(RequestValidationException);
    expect(exception.statusCode).toBe(400);
    expect(exception.message).toBe('firstName: Required; contact.email: Invalid email');
  });

  it('keeps the message alone when the issue has no path', () => {
    expect(buildRequestValidationException([{ message: 'Invalid body' }]).message).toBe(
      'Invalid body',
    );
  });
});

describe('toApiBody', () => {
  it('documents the zod schema as a swagger body without the json schema dialect', () => {
    const options = toApiBody(z.object({ headline: z.string().min(1) }));

    expect(options).toEqual({
      schema: expect.objectContaining({
        type: 'object',
        required: ['headline'],
        properties: { headline: { type: 'string', minLength: 1 } },
      }),
    });
    expect(options).not.toHaveProperty('schema.$schema');
  });
});
