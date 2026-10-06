import { DomainException } from '../../../common/exceptions/domain.exception.js';

export class VacancyNotFoundException extends DomainException {
  constructor() {
    super('La oportunidad no está disponible', 404);
  }
}
