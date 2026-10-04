import { DomainNotFoundError } from '../../../../common/domain/errors/domain.errors';

export class MessageNotFoundError extends DomainNotFoundError {
  constructor() {
    super('Message not found');
  }
}
