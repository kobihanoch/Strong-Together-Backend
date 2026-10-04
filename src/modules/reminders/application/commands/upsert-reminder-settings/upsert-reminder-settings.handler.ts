import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { RemindersRepository } from '../../ports/reminders.repository';
import { ReminderSettings } from '../../../domain/entities/reminder-settings';
import { UpsertReminderSettingsCommand } from './upsert-reminder-settings.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates or replaces a user's reminder settings. */
@CommandHandler(UpsertReminderSettingsCommand)
export class UpsertReminderSettingsHandler implements ICommandHandler<UpsertReminderSettingsCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: RemindersRepository,
  ) {}

  /**
   * Persists the complete reminder-settings state for a user.
   *
   * @param userId - The settings owner.
   * @param settings - The settings to persist.
   * @returns Nothing.
   */
  async execute(command: UpsertReminderSettingsCommand): Promise<void> {
    const { userId, settings } = command;
    return this.unitOfWork.execute(userId, async () => {
      const current = await this.repository.findByUserForUpdate();
      if (current) current.replace(settings);
      await this.repository.save(current ?? ReminderSettings.create(userId, settings));
    });
  }
}
