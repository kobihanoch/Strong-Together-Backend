import {
  ApplicationConflictError,
  ApplicationUnauthorizedError,
  ApplicationValidationError,
} from '../../../../../common/application/errors/application.errors';

/** Represents the verification bad request application failure. */
export class VerificationBadRequestError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}

/** Represents the verification unauthorized application failure. */
export class VerificationUnauthorizedError extends ApplicationUnauthorizedError {
  public constructor(message: string) {
    super(message);
  }
}

/** Represents the verification conflict application failure. */
export class VerificationConflictError extends ApplicationConflictError {
  public constructor(message: string) {
    super(message);
  }
}
