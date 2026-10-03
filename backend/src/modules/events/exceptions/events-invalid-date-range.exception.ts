import { DomainException } from '../../../common/exceptions/domain.exception.js';

export class EventsInvalidDateRangeException extends DomainException {
  constructor() {
    super('La fecha de inicio no puede ser posterior a la fecha de fin', 400);
  }
}
