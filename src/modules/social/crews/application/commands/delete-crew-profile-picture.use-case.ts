import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { CrewProfilePictureNotFoundError } from '../errors/crews.errors';
import { CrewImageStorage } from '../ports/crew-image-storage.port';
import { CrewsRepository } from '../ports/crews.repository';

/** Deletes a crew's profile picture. */
@Injectable()
export class DeleteCrewProfilePictureUseCase {
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
  public async execute(userId: string, crewId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const oldPath = await this.repository.getProfilePictureForUpdate(crewId);
      if (!oldPath) throw new CrewProfilePictureNotFoundError();
      await this.repository.updateProfilePicture(crewId, null);
      this.unitOfWork.afterCommit(() => this.storage.delete(oldPath));
    });
  }
}
