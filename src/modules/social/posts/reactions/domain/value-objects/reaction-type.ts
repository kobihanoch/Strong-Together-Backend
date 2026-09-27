/** Reaction type supported by social posts. */
export class ReactionType {
  public readonly value: 'like' | 'fire up' | 'muscle';

  public constructor(value: string) {
    if (value !== 'like' && value !== 'fire up' && value !== 'muscle') throw new Error('Reaction type is not supported');
    this.value = value;
  }
}
