import { ApplicationNotFoundError } from '../../../../../common/application/errors/application.errors';

/** Raised when a requested public social profile does not exist. */
export class SocialUserNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('User not found');
  }
}
