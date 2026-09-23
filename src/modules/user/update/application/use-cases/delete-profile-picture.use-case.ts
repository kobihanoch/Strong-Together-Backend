import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { ProfilePictureStorage } from '../ports/profile-picture-storage.port';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Deletes a user's stored profile picture. */
@Injectable()
export class DeleteProfilePictureUseCase {
  constructor(
    private readonly repository: UserProfileRepository,
    private readonly storage: ProfilePictureStorage,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Deletes a profile picture.
   *
   * @param userId - The user identifier.
   * @param path - The stored object path.
   * @returns Nothing.
   */
  async execute(userId: string, path: string): Promise<void> {
    await this.repository.updateProfilePicture(userId, null);
    this.hooks.afterCommit(() => this.storage.delete(path));
  }
}
