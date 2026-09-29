import { VerificationEmail } from '../value-objects/verification-email';
import { InvalidVerificationPasswordError, InvalidVerificationUsernameError } from '../errors/verification.errors';

/** Credentials and replacement email used to update an unverified account. */
export class UnverifiedEmailChange {
  public readonly username: string;
  public readonly password: string;
  public readonly newEmail: VerificationEmail;
  private constructor(username: string, password: string, newEmail: string) {
    const normalizedUsername = username.trim();
    if (normalizedUsername.length < 3 || normalizedUsername.length > 20 || !/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      throw new InvalidVerificationUsernameError();
    }
    if (password.length === 0 || password.length > 128) throw new InvalidVerificationPasswordError();
    this.username = normalizedUsername;
    this.password = password;
    this.newEmail = new VerificationEmail(newEmail);
  }

  static create(username: string, password: string, newEmail: string): UnverifiedEmailChange {
    return new UnverifiedEmailChange(username, password, newEmail);
  }
}
