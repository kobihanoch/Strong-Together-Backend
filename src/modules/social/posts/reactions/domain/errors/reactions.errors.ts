import { DomainValidationError } from '../../../../../../common/domain/errors/domain.errors';

export class InvalidReactionTypeError extends DomainValidationError {
  public constructor() {
    super('Reaction type is not supported');
  }
}
