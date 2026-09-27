import { ProfileEmail } from '../value-objects/profile-email';

/** Optional mutable profile values submitted by a user. */
export interface UserProfileChangeValues { username?: string | undefined; fullName?: string | undefined; email?: string | undefined }

/** Validated non-empty set of user profile changes. */
export class UserProfileChanges {
  public readonly username?: string | undefined;
  public readonly fullName?: string | undefined;
  public readonly email?: ProfileEmail | undefined;

  public constructor(values: UserProfileChangeValues) {
    if (values.username === undefined && values.fullName === undefined && values.email === undefined) {
      throw new Error('At least one profile field must be provided');
    }
    if (values.username !== undefined) {
      const username = values.username.trim();
      if (username.length < 3 || username.length > 15 || !/^[a-zA-Z0-9_]+$/.test(username)) throw new Error('Invalid username');
      this.username = username;
    }
    if (values.fullName !== undefined) {
      const fullName = values.fullName.trim();
      if (fullName.length === 0 || fullName.length > 20 || !/^[a-zA-Z\s]+$/.test(fullName)) throw new Error('Invalid full name');
      this.fullName = fullName;
    }
    if (values.email !== undefined) this.email = new ProfileEmail(values.email);
  }
}
