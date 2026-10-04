import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { AerobicsCache } from '../../ports/aerobics-cache.port';
import { AerobicsRepository } from '../../ports/aerobics.repository';
import { AerobicActivity } from '../../../domain/entities/aerobic-activity';
import { CreateAerobicActivityCommand } from './create-aerobic-activity.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates an aerobic entry and invalidates the user's cached history. */
@CommandHandler(CreateAerobicActivityCommand)
export class CreateAerobicActivityHandler implements ICommandHandler<CreateAerobicActivityCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
  ) {}

  /**
   * Creates an aerobic entry owned by a user.
   *
   * @param userId - The user who owns the new entry.
   * @param record - The aerobic activity values to persist.
   * @returns A promise that resolves after the entry is created.
   */
  async execute(command: CreateAerobicActivityCommand): Promise<void> {
    const { userId, record } = command;
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.create(AerobicActivity.create(record));
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
