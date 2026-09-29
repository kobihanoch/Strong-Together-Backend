import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class InvalidRegistrationEmailError extends DomainValidationError {
  constructor() {
    super('Invalid email format');
  }
}
export class RegistrationPasswordTooShortError extends DomainValidationError {
  constructor() {
    super('Password must be at least 8 characters long');
  }
}
export class RegistrationPasswordTooLongError extends DomainValidationError {
  constructor() {
    super('Password must be at most 128 characters long');
  }
}
export class RegistrationUsernameTooShortError extends DomainValidationError {
  constructor() {
    super('Username must be at least 3 characters');
  }
}
export class RegistrationUsernameTooLongError extends DomainValidationError {
  constructor() {
    super('Username must be at most 15 characters');
  }
}
export class InvalidRegistrationUsernameError extends DomainValidationError {
  constructor() {
    super('Username may contain letters, numbers, and underscore only');
  }
}
export class RegistrationFullNameTooLongError extends DomainValidationError {
  constructor() {
    super('Full name is too long');
  }
}
export class InvalidRegistrationFullNameError extends DomainValidationError {
  constructor() {
    super('Full name may contain letters and spaces only');
  }
}
export class InvalidRegistrationGenderError extends DomainValidationError {
  constructor() {
    super('Gender is not supported');
  }
}
