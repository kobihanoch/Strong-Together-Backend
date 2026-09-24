import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { ProfilePictureStorage } from '../ports/profile-picture-storage.port';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Deletes a user's stored profile picture. */
@Injectable()
export class DeleteProfilePictureUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: UserProfileRepository,
    private readonly storage: ProfilePictureStorage,
  ) {}
  /**
   * Deletes a profile picture.
   *
   * @param userId - The user identifier.
   * @param path - The stored object path.
   * @returns Nothing.
   */
  async execute(userId: string, path: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.updateProfilePicture(userId, null);
      this.unitOfWork.afterCommit(() => this.storage.delete(path));
    });
  }
}
