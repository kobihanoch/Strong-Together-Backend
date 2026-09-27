/** Visibility policy supported by a social crew. */
export class CrewPrivacy {
  public readonly value: 'public' | 'private';

  public constructor(value: string) {
    if (value !== 'public' && value !== 'private') throw new Error('Crew privacy must be public or private');
    this.value = value;
  }
}
