import { DomainException } from '../../../common/exceptions/domain.exception.js';

export class BlockOverlapException extends DomainException {
  constructor(message = 'El bloque se superpone con otro existente') {
    super(message, 409);
  }
}
