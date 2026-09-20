import type { ProfilePictureFile } from '../models/update-user.models';
/** Stores and deletes user profile pictures. */
export abstract class ProfilePictureStorage {
  abstract upload(userId: string, file: ProfilePictureFile): Promise<{ path: string; publicUrl: string }>;
  abstract delete(path: string): Promise<void>;
}
