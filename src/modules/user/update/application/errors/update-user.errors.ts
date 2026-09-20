/** Raised when an authenticated user cannot be found. */
export class UserNotFoundError extends Error {
  readonly statusCode = 404;
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}
/** Raised when profile identity fields conflict with another account. */
export class UserConflictError extends Error {
  readonly statusCode = 409;
  constructor() {
    super('Username or email already in use');
    this.name = 'UserConflictError';
  }
}
/** Raised when a profile-picture upload omits the image file. */
export class ProfilePictureRequiredError extends Error {
  readonly statusCode = 400;
  constructor() {
    super('No file provided');
    this.name = 'ProfilePictureRequiredError';
  }
}
