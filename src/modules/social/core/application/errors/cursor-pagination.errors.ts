import { ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when a pagination cursor cannot be decoded or validated. */
export class InvalidPaginationCursorError extends ApplicationValidationError {
  public constructor() {
    super('Invalid pagination cursor');
  }
}
