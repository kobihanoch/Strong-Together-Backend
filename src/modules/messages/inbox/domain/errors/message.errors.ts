import { DomainNotFoundError } from '../../../../../common/domain/errors/domain.errors';

/** Also used for inaccessible messages to avoid disclosing their existence. */
export class MessageNotFoundError extends DomainNotFoundError {
  constructor() {
    super('Message not found');
  }
}
