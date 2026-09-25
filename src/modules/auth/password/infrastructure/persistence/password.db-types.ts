import { user } from '../../../../../infrastructure/persistence/schema/drizzle/identity/user/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;

/** SQL row wrapping a password-reset recipient lookup. */
export interface PasswordResetRecipientSqlRow {
  userData: Pick<UserDbRow, 'id' | 'email' | 'name' | 'username'> | null;
}
