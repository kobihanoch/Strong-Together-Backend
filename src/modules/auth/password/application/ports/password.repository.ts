import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';

/** Password persistence required by the password-reset use cases. */
export abstract class PasswordRepository {
  abstract findResetRecipient(identifier: string): Promise<AuthEmailRecipient | null>;
  abstract updatePassword(userId: string, passwordHash: string): Promise<void>;
}
