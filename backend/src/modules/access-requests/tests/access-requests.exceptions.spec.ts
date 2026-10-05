import { describe, expect, it } from 'vitest';
import { DomainException } from '../../../common/exceptions/domain.exception.js';
import {
  AccessRequestNotEditableException,
  AccessRequestNotFoundException,
  DuplicateAccessRequestDataException,
  InvalidEntryYearException,
} from '../exceptions/index.js';

describe('excepciones de access-requests', () => {
  it.each([
    [AccessRequestNotFoundException, 404, 'La solicitud de acceso no existe'],
    [AccessRequestNotEditableException, 409, 'La solicitud ya fue enviada y no se puede modificar'],
    [DuplicateAccessRequestDataException, 409, 'Ya existe una cuenta o solicitud con estos datos'],
    [InvalidEntryYearException, 400, 'El año de ingreso no puede ser anterior a los 15 años de edad'],
  ])('%o usa el código y mensaje por defecto', (Exception, statusCode, message) => {
    const error = new Exception();
    expect(error).toBeInstanceOf(DomainException);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
  });

  it('permite un mensaje personalizado', () => {
    expect(new AccessRequestNotFoundException('otro').message).toBe('otro');
  });
});
