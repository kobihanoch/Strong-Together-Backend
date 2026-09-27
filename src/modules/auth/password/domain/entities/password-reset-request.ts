/** Validated account identifier used to request password recovery. */
export class PasswordResetRequest {
  public readonly identifier: string;
  public constructor(identifier: string) {
    const normalized = identifier.trim();
    if (normalized.length === 0) throw new Error('Please fill username or email');
    if (normalized.length > 254) throw new Error('Password reset identifier must be at most 254 characters');
    this.identifier = normalized;
  }
}
