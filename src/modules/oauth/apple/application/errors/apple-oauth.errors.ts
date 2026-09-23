import { ApplicationUnauthorizedError, ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when Apple OAuth input or token claims are invalid. */
export class InvalidAppleOAuthError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}

/** Raised when the linked account cannot start an authenticated session. */
export class AppleOAuthUnauthorizedError extends ApplicationUnauthorizedError {
  public constructor(message: string) {
    super(message);
  }
}
