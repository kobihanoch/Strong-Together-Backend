import {
  ApplicationConflictError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from '../../../../../common/application/errors/application.errors';

/** Raised when an authenticated user cannot be found. */
export class UserNotFoundError extends ApplicationNotFoundError {
  constructor() {
    super('User not found');
  }
}
/** Raised when profile identity fields conflict with another account. */
export class UserConflictError extends ApplicationConflictError {
  constructor() {
    super('Username or email already in use');
  }
}
/** Raised when a profile-picture upload omits the image file. */
export class ProfilePictureRequiredError extends ApplicationValidationError {
  constructor() {
    super('No file provided');
  }
}
