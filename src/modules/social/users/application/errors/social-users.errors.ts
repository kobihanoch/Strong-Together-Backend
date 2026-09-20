/** Raised when a requested public social profile does not exist. */
export class SocialUserNotFoundError extends Error {
  public readonly statusCode = 404;

  public constructor() {
    super('User not found');
    this.name = SocialUserNotFoundError.name;
  }
}
