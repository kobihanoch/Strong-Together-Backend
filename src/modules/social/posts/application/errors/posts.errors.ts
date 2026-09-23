import { ApplicationNotFoundError, ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when a post is absent or inaccessible. */

export class PostNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Post not found');
  }
}
/** Raised when a crew-only post has no target crews. */
export class CrewTargetRequiredError extends ApplicationValidationError {
  public constructor() {
    super('Crew-only post must target at least one crew');
  }
}
