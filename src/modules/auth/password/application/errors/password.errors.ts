import { ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Represents the password bad request application failure. */
export class PasswordBadRequestError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}
