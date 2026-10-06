import { PostContentRequiredError, PostContentTooLongError } from '../errors/posts.errors';

/** Normalized textual content of a social post. */
export class PostContent {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new PostContentRequiredError();
    if (normalized.length > 5_000) throw new PostContentTooLongError();
    this.value = normalized;
  }
}
