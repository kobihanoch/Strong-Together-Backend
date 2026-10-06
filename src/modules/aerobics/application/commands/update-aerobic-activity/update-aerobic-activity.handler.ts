import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { AerobicEntryNotFoundError } from '../../errors/aerobic-entry-not-found.error';
import { AerobicsCache } from '../../ports/aerobics-cache.port';
import { AerobicsRepository } from '../../ports/aerobics.repository';
import { UpdateAerobicActivityCommand } from './update-aerobic-activity.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Replaces an owned aerobic entry. */
@CommandHandler(UpdateAerobicActivityCommand)
export class UpdateAerobicActivityHandler implements ICommandHandler<UpdateAerobicActivityCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
  ) {}

  /**
   * Replaces an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the entry.
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic activity values.
   * @returns A promise that resolves after the entry is updated.
   * @throws {AerobicEntryNotFoundError} When the owned entry does not exist.
   */
  async execute(command: UpdateAerobicActivityCommand): Promise<void> {
    const { userId, id, record } = command;
    return this.unitOfWork.execute(userId, async () => {
      const activity = await this.repository.findByIdForUpdate(id);
      if (!activity) throw new AerobicEntryNotFoundError();
      activity.update(record);
      if (!(await this.repository.save(activity))) throw new AerobicEntryNotFoundError();
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
