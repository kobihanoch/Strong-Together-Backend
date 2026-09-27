/** Normalized textual content of a post comment. */
export class CommentContent {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new Error('Comment content is required');
    if (normalized.length > 2_000) throw new Error('Comment content must be at most 2000 characters');
    this.value = normalized;
  }
}
