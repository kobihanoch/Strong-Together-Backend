import type { AuthEmailContext } from '../../../core/application/models/auth.models';

/** Sends account-verification email messages. */
export abstract class VerificationEmailSender {
  abstract send(email: string, userId: string, fullName: string, context?: AuthEmailContext): Promise<void>;
}
