import {
  ApplicationConflictError,
  ApplicationUnauthorizedError,
  ApplicationValidationError,
} from '../../../../../common/application/errors/application.errors';

export class VerificationBadRequestError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}

export class VerificationUnauthorizedError extends ApplicationUnauthorizedError {
  public constructor(message: string) {
    super(message);
  }
}

export class VerificationConflictError extends ApplicationConflictError {
  public constructor(message: string) {
    super(message);
  }
}
