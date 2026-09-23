import { ApplicationNotFoundError } from '../../../../../../common/application/errors/application.errors';

/** Raised when a post cannot receive a reaction. */ export class PostNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Post not found');
  }
}
/** Raised when a reaction is absent or inaccessible. */ export class ReactionNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Reaction not found');
  }
}
