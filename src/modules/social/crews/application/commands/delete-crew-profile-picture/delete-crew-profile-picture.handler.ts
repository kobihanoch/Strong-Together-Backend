import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { CrewProfilePictureNotFoundError } from '../../errors/crews.errors';
import { CrewImageStorage } from '../../ports/crew-image-storage.port';
import { CrewsRepository } from '../../ports/crews.repository';
import { DeleteCrewProfilePictureCommand } from './delete-crew-profile-picture.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes a crew's profile picture. */
@CommandHandler(DeleteCrewProfilePictureCommand)
export class DeleteCrewProfilePictureHandler implements ICommandHandler<DeleteCrewProfilePictureCommand> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CrewsRepository,
    private readonly storage: CrewImageStorage,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @returns Nothing after deletion.
   * @throws {CrewProfilePictureNotFoundError} When no picture can be removed.
   */
  public async execute(command: DeleteCrewProfilePictureCommand): Promise<void> {
    const { userId, crewId } = command;
    return this.unitOfWork.execute(userId, async () => {
      const oldPath = await this.repository.getProfilePictureForUpdate(crewId);
      if (!oldPath) throw new CrewProfilePictureNotFoundError();
      await this.repository.updateProfilePicture(crewId, null);
      this.unitOfWork.afterCommit(() => this.storage.delete(oldPath));
    });
  }
}
