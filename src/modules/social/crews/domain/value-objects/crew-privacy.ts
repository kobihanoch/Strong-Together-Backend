import { InvalidCrewPrivacyError } from '../errors/crews.errors';

/** Visibility policy supported by a social crew. */
export class CrewPrivacy {
  public readonly value: 'public' | 'private';

  public constructor(value: string) {
    if (value !== 'public' && value !== 'private') throw new InvalidCrewPrivacyError();
    this.value = value;
  }
}
