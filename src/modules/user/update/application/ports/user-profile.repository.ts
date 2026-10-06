import type { UserProfile } from '../../domain/entities/user-profile';
import type { ProfileEmail } from '../../domain/value-objects/profile-email';
import type { UpdateUserEmailOutcome } from '../models/update-user.models';
/** Provides persistence operations for user profile management. */
export abstract class UserProfileRepository {
  abstract findByIdForUpdate(): Promise<UserProfile | undefined>;
  abstract save(profile: UserProfile): Promise<void>;
  abstract updateEmail(userId: string, email: ProfileEmail): Promise<UpdateUserEmailOutcome>;
  abstract delete(): Promise<void>;
  abstract findProfilePicture(): Promise<string | null>;
  abstract updateProfilePicture(path: string | null): Promise<void>;
}
