import type { AuthEmailContext } from '../../../core/application/models/auth.models';

/** Sends password-reset email messages. */
export abstract class PasswordResetEmailSender {
  abstract send(email: string, userId: string, fullName: string, context?: AuthEmailContext): Promise<void>;
}
