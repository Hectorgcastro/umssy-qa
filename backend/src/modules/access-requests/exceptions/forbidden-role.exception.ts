import { DomainException } from '../../../common/exceptions/domain.exception.js';

export class ForbiddenRoleException extends DomainException {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message, 403);
  }
}
