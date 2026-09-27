import { CommentContentRequiredError, CommentContentTooLongError } from '../errors/comments.errors';

/** Normalized textual content of a post comment. */
export class CommentContent {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new CommentContentRequiredError();
    if (normalized.length > 2_000) throw new CommentContentTooLongError();
    this.value = normalized;
  }
}
