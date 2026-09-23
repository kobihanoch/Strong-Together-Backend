import { ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

export class PasswordBadRequestError extends ApplicationValidationError {
  public constructor(message: string) {
    super(message);
  }
}
