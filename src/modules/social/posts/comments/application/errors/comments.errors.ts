/** Raised when a post cannot receive a comment. */ export class PostNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Post not found');
    this.name = PostNotFoundError.name;
  }
}
/** Raised when a comment is absent or inaccessible. */ export class CommentNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Comment not found');
    this.name = CommentNotFoundError.name;
  }
}
