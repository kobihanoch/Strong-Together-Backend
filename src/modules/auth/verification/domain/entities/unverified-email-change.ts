import { VerificationEmail } from '../value-objects/verification-email';

/** Credentials and replacement email used to update an unverified account. */
export class UnverifiedEmailChange {
  public readonly username: string;
  public readonly password: string;
  public readonly newEmail: VerificationEmail;
  public constructor(username: string, password: string, newEmail: string) {
    const normalizedUsername = username.trim();
    if (normalizedUsername.length < 3 || normalizedUsername.length > 20 || !/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      throw new Error('Invalid username');
    }
    if (password.length === 0 || password.length > 128) throw new Error('Invalid password');
    this.username = normalizedUsername;
    this.password = password;
    this.newEmail = new VerificationEmail(newEmail);
  }
}
