import { InvalidProfileFullNameError, InvalidProfileUsernameError, UserProfileChangeRequiredError } from '../errors/user-profile.errors';
import { ProfileEmail } from '../value-objects/profile-email';

export interface UserProfileValues {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicturePath: string | null;
}

export interface UserProfileChangeValues {
  username?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
}

/** A user's mutable profile and the behavior that changes it. */
export class UserProfile {
  private pendingEmailValue: ProfileEmail | undefined;

  private constructor(
    public readonly id: string,
    public username: string,
    public fullName: string,
    public readonly email: ProfileEmail,
    public profilePicturePath: string | null,
  ) {}

  static restore(values: UserProfileValues): UserProfile {
    return new UserProfile(values.id, values.username, values.fullName, new ProfileEmail(values.email), values.profilePicturePath);
  }

  get pendingEmail(): ProfileEmail | undefined {
    return this.pendingEmailValue;
  }

  changeDetails(values: UserProfileChangeValues): void {
    if (values.username === undefined && values.fullName === undefined && values.email === undefined) {
      throw new UserProfileChangeRequiredError();
    }
    if (values.username !== undefined) {
      const username = values.username.trim();
      if (username.length < 3 || username.length > 15 || !/^[a-zA-Z0-9_]+$/.test(username)) throw new InvalidProfileUsernameError();
      this.username = username;
    }
    if (values.fullName !== undefined) {
      const fullName = values.fullName.trim();
      if (fullName.length === 0 || fullName.length > 20 || !/^[a-zA-Z\s]+$/.test(fullName)) throw new InvalidProfileFullNameError();
      this.fullName = fullName;
    }
    if (values.email !== undefined) {
      const email = new ProfileEmail(values.email);
      this.pendingEmailValue = email.value === this.email.value ? undefined : email;
    }
  }

  replaceProfilePicture(path: string | null): void {
    this.profilePicturePath = path;
  }
}
