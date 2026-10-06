import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { RemindersRepository } from '../../ports/reminders.repository';
import { UpdateReminderTimeZoneCommand } from './update-reminder-time-zone.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Updates the time zone without changing whether reminders are enabled. */
@CommandHandler(UpdateReminderTimeZoneCommand)
export class UpdateReminderTimeZoneHandler implements ICommandHandler<UpdateReminderTimeZoneCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: RemindersRepository,
  ) {}

  /**
   * Updates only a user's reminder time zone.
   *
   * @param userId - The settings owner.
   * @param settings - The new time zone.
   * @returns Nothing.
   */
  async execute(command: UpdateReminderTimeZoneCommand): Promise<void> {
    const { userId, settings } = command;
    return this.unitOfWork.execute(userId, async () => {
      const current = await this.repository.findByUserForUpdate();
      if (!current) return;
      current.changeTimeZone(settings.timeZone);
      await this.repository.save(current);
    });
  }
}
