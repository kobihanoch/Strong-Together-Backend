import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { ProfilePictureStorage } from '../../ports/profile-picture-storage.port';
import { UserProfileRepository } from '../../ports/user-profile.repository';
import { DeleteProfilePictureCommand } from './delete-profile-picture.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
/** Deletes a user's stored profile picture. */
@CommandHandler(DeleteProfilePictureCommand)
export class DeleteProfilePictureHandler implements ICommandHandler<DeleteProfilePictureCommand> {
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
  async execute(command: DeleteProfilePictureCommand): Promise<void> {
    const { userId, path } = command;
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.updateProfilePicture(null);
      this.unitOfWork.afterCommit(() => this.storage.delete(path));
    });
  }
}
