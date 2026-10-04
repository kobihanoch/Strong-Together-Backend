import type { RotatedSession, RotateSessionOutcome } from '../../../core/application/models/auth.models';
import type { AuthAccount } from '../../../core/domain/entities/auth-account';
import type { LoginIdentifier } from '../../domain/value-objects/login-identifier';

/** Session persistence required by session and OAuth use cases. */
export abstract class SessionRepository {
  abstract findByIdentifier(identifier: LoginIdentifier): Promise<AuthAccount | undefined>;
  abstract findLastLogin(userId: string): Promise<Date | null>;
  abstract rotate(userId: string): Promise<RotatedSession>;
  abstract rotateIfVersion(userId: string, previousTokenVersion: number): Promise<RotateSessionOutcome>;
  abstract findTokenVersion(userId: string): Promise<number | null>;
  abstract clearPushToken(userId: string): Promise<void>;
  abstract logout(userId: string): Promise<void>;
}
