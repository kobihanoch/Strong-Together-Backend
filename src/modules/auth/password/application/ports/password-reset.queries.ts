import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';
import type { PasswordResetRequest } from '../../domain/entities/password-reset-request';

/** Read projection used to address password-recovery emails. */
export abstract class PasswordResetQueries {
  abstract findRecipient(request: PasswordResetRequest): Promise<AuthEmailRecipient | undefined>;
}
