/** Audience visibility supported by social posts. */
export class PostVisibility {
  public readonly value: 'crews_only' | 'public';

  public constructor(value: string) {
    if (value !== 'crews_only' && value !== 'public') throw new Error('Post visibility must be crews_only or public');
    this.value = value;
  }
}
