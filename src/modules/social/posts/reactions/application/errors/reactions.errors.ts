/** Raised when a post cannot receive a reaction. */ export class PostNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Post not found');
    this.name = PostNotFoundError.name;
  }
}
/** Raised when a reaction is absent or inaccessible. */ export class ReactionNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Reaction not found');
    this.name = ReactionNotFoundError.name;
  }
}
