import { InvalidPostVisibilityError } from '../errors/posts.errors';

/** Audience visibility supported by social posts. */
export class PostVisibility {
  public readonly value: 'crews_only' | 'public';

  public constructor(value: string) {
    if (value !== 'crews_only' && value !== 'public') throw new InvalidPostVisibilityError();
    this.value = value;
  }
}
