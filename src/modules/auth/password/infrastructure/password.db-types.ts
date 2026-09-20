import type { AuthEmailRecipient } from '../../core/application/models/auth.models';

/** SQL row wrapping a password-reset recipient lookup. */
export interface PasswordResetRecipientSqlRow {
  userData: AuthEmailRecipient | null;
}
