import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';
import type { AuthAccount } from '../../../core/domain/entities/auth-account';
import type { VerificationEmail } from '../../domain/value-objects/verification-email';

/** Account-verification persistence required by the verification use cases. */
export abstract class VerificationRepository {
  abstract findByEmail(email: VerificationEmail): Promise<AuthEmailRecipient | undefined>;
  abstract findByUsername(username: string): Promise<AuthAccount | undefined>;
  abstract emailExists(email: VerificationEmail): Promise<boolean>;
  abstract updateVerification(userId: string, verified: boolean): Promise<void>;
  abstract updateEmail(userId: string, email: VerificationEmail): Promise<void>;
}
