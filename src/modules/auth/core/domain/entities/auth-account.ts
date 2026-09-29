import { AccountAlreadyVerifiedError } from '../errors/auth-account.errors';

export interface AuthAccountValues {
  id: string;
  name: string | null;
  username: string;
  email?: string | undefined;
  passwordHash: string | null;
  role: string;
  isVerified: boolean;
  lastLogin?: string | null | undefined;
}

/** Account state required by authentication commands. */
export class AuthAccount {
  private constructor(
    public readonly id: string,
    public readonly name: string | null,
    public readonly username: string,
    public readonly email: string | undefined,
    public readonly passwordHash: string | null,
    public readonly role: string,
    public readonly isVerified: boolean,
    public readonly lastLogin: string | null | undefined,
  ) {}

  static restore(values: AuthAccountValues): AuthAccount {
    return new AuthAccount(
      values.id,
      values.name,
      values.username,
      values.email,
      values.passwordHash,
      values.role,
      values.isVerified,
      values.lastLogin,
    );
  }

  ensureEmailCanBeChangedBeforeVerification(): void {
    if (this.isVerified) throw new AccountAlreadyVerifiedError();
  }
}
