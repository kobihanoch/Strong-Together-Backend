import type { AuthEmailRecipient, LoginUser } from '../../core/application/models/auth.models';

/** Raw username lookup before database field normalization. */
export interface VerificationUserRawSqlResult extends Omit<LoginUser, 'passwordHash' | 'isVerified'> {
  password_hash: string | null;
  is_verified: boolean;
}

/** SQL row wrapping a username lookup. */
export interface VerificationUserSqlRow {
  userData: VerificationUserRawSqlResult | null;
}

/** SQL row wrapping an email-recipient lookup. */
export interface VerificationRecipientSqlRow {
  userData: Omit<AuthEmailRecipient, 'email'> | null;
}

/** SQL row returned by the email-existence function. */
export interface EmailExistsSqlRow {
  id: string | null;
}

/** SQL row returned by the public verification-state function. */
export interface VerificationStatusSqlRow {
  is_verified: boolean | null;
}
