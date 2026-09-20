import type { LoginUser, RotatedSession } from '../../../core/application/models/auth.models';

/** Session persistence required by session and OAuth use cases. */
export abstract class SessionRepository {
  abstract findLoginUser(identifier: string): Promise<LoginUser | null>;
  abstract findLastLogin(userId: string): Promise<Date | null>;
  abstract rotate(userId: string): Promise<RotatedSession>;
  abstract rotateIfVersion(userId: string, previousTokenVersion: number): Promise<RotatedSession | null>;
  abstract findTokenVersion(userId: string): Promise<number | null>;
  abstract clearPushToken(userId: string): Promise<void>;
  abstract logout(userId: string): Promise<void>;
}
