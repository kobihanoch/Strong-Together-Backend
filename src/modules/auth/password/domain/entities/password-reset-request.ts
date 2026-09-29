/** Validated account identifier used to request password recovery. */
export class PasswordResetRequest {
  public readonly identifier: string;
  private constructor(identifier: string) {
    const normalized = identifier.trim();
    if (normalized.length === 0) throw new PasswordResetIdentifierRequiredError();
    if (normalized.length > 254) throw new PasswordResetIdentifierTooLongError();
    this.identifier = normalized;
  }

  static create(identifier: string): PasswordResetRequest {
    return new PasswordResetRequest(identifier);
  }
}
import { PasswordResetIdentifierRequiredError, PasswordResetIdentifierTooLongError } from '../errors/password.errors';
