import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class AccountAlreadyVerifiedError extends DomainValidationError {
  constructor() {
    super('Account already verified');
  }
}
