import { DomainValidationError } from '../../../../../../common/domain/errors/domain.errors';

export class CommentContentRequiredError extends DomainValidationError {
  public constructor() {
    super('Comment content is required');
  }
}

export class CommentContentTooLongError extends DomainValidationError {
  public constructor() {
    super('Comment content must be at most 2000 characters');
  }
}
