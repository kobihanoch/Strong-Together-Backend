import type { UserProfileChanges } from '../../domain/entities/user-profile-changes';
import type { ProfileEmail } from '../../domain/value-objects/profile-email';
import type { UpdateUserEmailOutcome, UpdateUserProfileOutcome, UserProfile } from '../models/update-user.models';
/** Provides persistence operations for user profile management. */
export abstract class UserProfileRepository {
  abstract find(userId: string): Promise<UserProfile | null>;
  abstract update(userId: string, changes: UserProfileChanges): Promise<UpdateUserProfileOutcome>;
  abstract updateEmail(userId: string, email: ProfileEmail): Promise<UpdateUserEmailOutcome>;
  abstract delete(userId: string): Promise<void>;
  abstract findProfilePicture(userId: string): Promise<string | null>;
  abstract updateProfilePicture(userId: string, path: string | null): Promise<void>;
}
