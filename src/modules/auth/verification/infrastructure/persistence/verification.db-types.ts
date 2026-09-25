import { user } from '../../../../../infrastructure/db/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** Raw username lookup before database field normalization. */
export interface VerificationUserRawSqlResult extends Pick<UserDbRow, 'id' | 'name' | 'username' | 'role'> {
  password_hash: UserDbRow['passwordHash'];
  is_verified: UserDbRow['isVerified'];
}

/** SQL row wrapping a username lookup. */
export interface VerificationUserSqlRow {
  userData: VerificationUserRawSqlResult | null;
}

/** SQL row wrapping an email-recipient lookup. */
export interface VerificationRecipientSqlRow {
  userData: Pick<UserDbRow, 'id' | 'name' | 'username'> | null;
}

/** SQL row returned by the email-existence function. */
export interface EmailExistsSqlRow {
  id: UserDbRow['id'] | null;
}

/** SQL row returned by the public verification-state function. */
export interface VerificationStatusSqlRow {
  is_verified: UserDbRow['isVerified'] | null;
}
