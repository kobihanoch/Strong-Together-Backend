import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { ProfilePictureRequiredError } from '../errors/update-user.errors';
import type { ProfilePictureFile, ProfilePictureResult, UserOperationLogger } from '../models/update-user.models';
import { ProfilePictureStorage } from '../ports/profile-picture-storage.port';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Replaces a user's profile picture and cleans up the prior object. */
@Injectable()
export class ReplaceProfilePictureUseCase {
  constructor(
    private readonly repository: UserProfileRepository,
    private readonly storage: ProfilePictureStorage,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Replaces a profile picture and schedules deletion of the previous object.
   * @param userId - The user identifier.
   * @param file - Uploaded image data.
   * @param logger - Operation logger used for best-effort cleanup failures.
   * @returns The new path and public URL.
   * @throws {ProfilePictureRequiredError} When no image is supplied.
   */
  async execute(userId: string, file: ProfilePictureFile | undefined, logger: UserOperationLogger): Promise<ProfilePictureResult> {
    if (!file) throw new ProfilePictureRequiredError();
    const oldPath = await this.repository.findProfilePicture(userId);
    const uploaded = await this.storage.upload(userId, file);
    await this.repository.updateProfilePicture(userId, uploaded.path);
    if (oldPath && oldPath !== uploaded.path)
      this.hooks.afterCommit(async () => {
        void this.storage
          .delete(oldPath)
          .catch((error: any) =>
            logger.warn(
              { err: error, event: 'user.old_profile_image_delete_failed', userId, oldPath, responseData: error?.response?.data },
              'Failed to delete old profile image',
            ),
          );
      });
    return { profilePicPath: uploaded.path, url: uploaded.publicUrl, message: 'Upload success' };
  }
}
