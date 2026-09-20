import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { CrewProfilePictureNotFoundError } from '../errors/crews.errors';
import { CrewImageStorage } from '../ports/crew-image-storage.port';
import { CrewsRepository } from '../ports/crews.repository';

/** Deletes a crew's profile picture. */
@Injectable()
export class DeleteCrewProfilePictureUseCase {
  public constructor(
    private readonly repository: CrewsRepository,
    private readonly storage: CrewImageStorage,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Executes the application operation.
   *
   *
   * @param crewId - Crew identifier.
   * @returns Nothing after deletion.
   * @throws {CrewProfilePictureNotFoundError} When no picture can be removed. */
  public async execute(crewId: string): Promise<void> {
    const oldPath = await this.repository.getProfilePictureForUpdate(crewId);
    if (!oldPath) throw new CrewProfilePictureNotFoundError();
    await this.repository.updateProfilePicture(crewId, null);
    this.hooks.afterCommit(() => this.storage.delete(oldPath));
  }
}
