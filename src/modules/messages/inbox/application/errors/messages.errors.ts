import { ApplicationNotFoundError } from '../../../../../common/application/errors/application.errors';

/** Raised when a message is absent or inaccessible to the requesting user. */
export class MessageNotFoundError extends ApplicationNotFoundError {
  constructor() {
    super('Message not found');
  }
}
