import { DomainException } from '../../../common/exceptions/domain.exception.js';

export class InvalidEntryYearException extends DomainException {
  constructor(message = 'El año de ingreso no puede ser anterior a los 15 años de edad') {
    super(message, 400);
  }
}
