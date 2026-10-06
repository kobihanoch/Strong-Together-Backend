import { ApplicationUnauthorizedError, ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when Google OAuth input or token claims are invalid. */
export class InvalidGoogleOAuthError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}

/** Raised when the linked account cannot start an authenticated session. */
export class GoogleOAuthUnauthorizedError extends ApplicationUnauthorizedError {
  public constructor(message: string) {
    super(message);
  }
}
