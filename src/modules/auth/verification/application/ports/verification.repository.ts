import type { AuthEmailRecipient, LoginUser } from '../../../core/application/models/auth.models';

/** Account-verification persistence required by the verification use cases. */
export abstract class VerificationRepository {
  abstract findByEmail(email: string): Promise<AuthEmailRecipient | null>;
  abstract findByUsername(username: string): Promise<LoginUser | null>;
  abstract emailExists(email: string): Promise<boolean>;
  abstract updateVerification(userId: string, verified: boolean): Promise<void>;
  abstract updateEmail(userId: string, email: string): Promise<void>;
}
