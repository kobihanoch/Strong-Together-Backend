import type { LoginUser, RotatedSession } from '../../core/application/models/auth.models';

/** Raw payload returned by the guest login function before field normalization. */
export interface LoginUserRawSqlResult extends Omit<LoginUser, 'passwordHash' | 'isVerified' | 'lastLogin'> {
  password_hash: string | null;
  is_verified: boolean;
  last_login: string | null;
}

/** SQL row wrapping a guest login-function result. */
export interface LoginUserSqlRow {
  userData: LoginUserRawSqlResult | null;
}

/** SQL row returned by the last-login lookup. */
export interface LastLoginSqlRow {
  lastLogin: Date | null;
}

/** SQL row returned by session rotation. */
export type RotatedSessionSqlRow = RotatedSession;

/** SQL row returned by token-version lookup. */
export interface TokenVersionSqlRow {
  tokenVersion: number;
}
