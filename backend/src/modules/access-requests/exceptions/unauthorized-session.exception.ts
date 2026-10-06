import { DomainException } from '../../../common/exceptions/domain.exception.js';

export class UnauthorizedSessionException extends DomainException {
  constructor(message = 'Debes iniciar sesión para continuar') {
    super(message, 401);
  }
}
