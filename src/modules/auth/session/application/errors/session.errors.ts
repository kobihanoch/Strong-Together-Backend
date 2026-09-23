import { ApplicationUnauthorizedError, ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

export class SessionBadRequestError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}

export class SessionUnauthorizedError extends ApplicationUnauthorizedError {
  public constructor(message: string) {
    super(message);
  }
}
