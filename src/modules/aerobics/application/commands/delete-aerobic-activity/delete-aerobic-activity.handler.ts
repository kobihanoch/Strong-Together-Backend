import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { AerobicEntryNotFoundError } from '../../errors/aerobic-entry-not-found.error';
import { AerobicsCache } from '../../ports/aerobics-cache.port';
import { AerobicsRepository } from '../../ports/aerobics.repository';
import { DeleteAerobicActivityCommand } from './delete-aerobic-activity.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes an owned aerobic entry. */
@CommandHandler(DeleteAerobicActivityCommand)
export class DeleteAerobicActivityHandler implements ICommandHandler<DeleteAerobicActivityCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
  ) {}

  /**
   * Deletes an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the entry.
   * @param id - The aerobic entry identifier.
   * @returns A promise that resolves after the entry is deleted.
   * @throws {AerobicEntryNotFoundError} When the owned entry does not exist.
   */
  async execute(command: DeleteAerobicActivityCommand): Promise<void> {
    const { userId, id } = command;
    return this.unitOfWork.execute(userId, async () => {
      if (!(await this.repository.delete(id))) throw new AerobicEntryNotFoundError();
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
