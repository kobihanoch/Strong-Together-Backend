/** Raised when registration conflicts with an existing account. */
export class UserAlreadyExistsError extends Error {
  readonly statusCode = 400;
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsError';
  }
}
