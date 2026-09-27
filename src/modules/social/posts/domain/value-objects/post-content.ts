/** Normalized textual content of a social post. */
export class PostContent {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new Error('Post content is required');
    if (normalized.length > 5_000) throw new Error('Post content must be at most 5000 characters');
    this.value = normalized;
  }
}
