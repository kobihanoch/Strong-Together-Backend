/** Raised when a message is absent or inaccessible to the requesting user. */
export class MessageNotFoundError extends Error {
  readonly statusCode = 404;

  constructor() {
    super('Message not found');
    this.name = 'MessageNotFoundError';
  }
}
