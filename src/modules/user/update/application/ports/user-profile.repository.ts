import type { UpdateUserInput, UserProfile } from '../models/update-user.models';
/** Provides persistence operations for user profile management. */
export abstract class UserProfileRepository {
  abstract find(userId: string): Promise<UserProfile | null>;
  abstract update(userId: string, input: UpdateUserInput): Promise<UserProfile | null>;
  abstract updateEmail(userId: string, email: string): Promise<void>;
  abstract delete(userId: string): Promise<void>;
  abstract findProfilePicture(userId: string): Promise<string | null>;
  abstract updateProfilePicture(userId: string, path: string | null): Promise<void>;
}
