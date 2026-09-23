import { ApplicationUnauthorizedError, ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Represents the session bad request application failure. */
export class SessionBadRequestError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}

/** Represents the session unauthorized application failure. */
export class SessionUnauthorizedError extends ApplicationUnauthorizedError {
  public constructor(message: string) {
    super(message);
  }
}
