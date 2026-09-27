import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';
import type { PasswordResetRequest } from '../../domain/entities/password-reset-request';

/** Password persistence required by the password-reset use cases. */
export abstract class PasswordRepository {
  abstract findResetRecipient(request: PasswordResetRequest): Promise<AuthEmailRecipient | null>;
  abstract updatePassword(userId: string, passwordHash: string): Promise<void>;
}
