import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class PasswordResetIdentifierRequiredError extends DomainValidationError {
  constructor() {
    super('Please fill username or email');
  }
}
export class PasswordResetIdentifierTooLongError extends DomainValidationError {
  constructor() {
    super('Password reset identifier must be at most 254 characters');
  }
}
export class NewPasswordTooShortError extends DomainValidationError {
  constructor() {
    super('Password must be at least 8 characters long');
  }
}
export class NewPasswordTooLongError extends DomainValidationError {
  constructor() {
    super('Password must be at most 128 characters long');
  }
}
