import { InvalidProfileEmailError } from '../errors/user-profile.errors';

/** Normalized email address used by a user profile. */
export class ProfileEmail {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new InvalidProfileEmailError();
    this.value = normalized;
  }
}
