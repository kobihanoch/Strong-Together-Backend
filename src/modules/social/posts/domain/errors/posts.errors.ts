import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class PostContentRequiredError extends DomainValidationError {
  public constructor() {
    super('Post content is required');
  }
}

export class PostContentTooLongError extends DomainValidationError {
  public constructor() {
    super('Post content must be at most 5000 characters');
  }
}

export class InvalidPostVisibilityError extends DomainValidationError {
  public constructor() {
    super('Post visibility must be crews_only or public');
  }
}

export class PostCrewTargetsRequiredError extends DomainValidationError {
  public constructor() {
    super('Crew-only posts require at least one crew');
  }
}

export class DuplicatePostCrewTargetsError extends DomainValidationError {
  public constructor() {
    super('Crew IDs must be unique');
  }
}

export class TooManyPostCrewTargetsError extends DomainValidationError {
  public constructor() {
    super('A post cannot target more than 100 crews');
  }
}
