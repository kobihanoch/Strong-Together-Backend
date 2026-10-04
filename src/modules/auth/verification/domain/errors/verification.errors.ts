import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class InvalidVerificationUsernameError extends DomainValidationError {
  constructor() {
    super('Invalid username');
  }
}
export class InvalidVerificationPasswordError extends DomainValidationError {
  constructor() {
    super('Invalid password');
  }
}
export class InvalidVerificationEmailError extends DomainValidationError {
  constructor() {
    super('Invalid email');
  }
}
