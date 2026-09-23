import { ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when registration conflicts with an existing account. */
export class UserAlreadyExistsError extends ApplicationValidationError {
  constructor() {
    super('User already exists');
  }
}
