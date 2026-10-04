import { InvalidReactionTypeError } from '../errors/reactions.errors';

/** Reaction type supported by social posts. */
export class ReactionType {
  public readonly value: 'like' | 'fire up' | 'muscle';

  public constructor(value: string) {
    if (value !== 'like' && value !== 'fire up' && value !== 'muscle') throw new InvalidReactionTypeError();
    this.value = value;
  }
}
