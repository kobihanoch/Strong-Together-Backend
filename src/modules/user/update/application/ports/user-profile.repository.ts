import type { UserProfile } from '../../domain/entities/user-profile';
import type { ProfileEmail } from '../../domain/value-objects/profile-email';
import type { UpdateUserEmailOutcome } from '../models/update-user.models';
/** Provides persistence operations for user profile management. */
export abstract class UserProfileRepository {
  abstract findByIdForUpdate(userId: string): Promise<UserProfile | undefined>;
  abstract save(profile: UserProfile): Promise<void>;
  abstract updateEmail(userId: string, email: ProfileEmail): Promise<UpdateUserEmailOutcome>;
  abstract delete(userId: string): Promise<void>;
  abstract findProfilePicture(userId: string): Promise<string | null>;
  abstract updateProfilePicture(userId: string, path: string | null): Promise<void>;
}
