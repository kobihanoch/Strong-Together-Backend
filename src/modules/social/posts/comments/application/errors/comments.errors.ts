import { ApplicationNotFoundError } from '../../../../../../common/application/errors/application.errors';

/** Raised when a post cannot receive a comment. */ export class PostNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Post not found');
  }
}
/** Raised when a comment is absent or inaccessible. */ export class CommentNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Comment not found');
  }
}
