import { DomainConflictError, DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class UserProfileChangeRequiredError extends DomainValidationError {
  constructor() { super('At least one profile field must be provided'); }
}

export class InvalidProfileUsernameError extends DomainValidationError {
  constructor() { super('Invalid username'); }
}

export class InvalidProfileFullNameError extends DomainValidationError {
  constructor() { super('Invalid full name'); }
}

export class InvalidProfileEmailError extends DomainValidationError {
  constructor() { super('Invalid email format'); }
}

export class UserProfileIdentityConflictError extends DomainConflictError {
  constructor() { super('Username or email already in use'); }
}
