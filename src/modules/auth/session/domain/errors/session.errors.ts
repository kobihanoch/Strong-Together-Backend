import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class InvalidLoginIdentifierError extends DomainValidationError {
  constructor() { super('Must be a valid email or username'); }
}

export class InvalidLoginPasswordError extends DomainValidationError {
  constructor() { super('Username and password are required'); }
}
