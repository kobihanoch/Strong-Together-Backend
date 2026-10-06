import { Command, type ICommand } from '@nestjs/cqrs';
import type { UpsertReminderSettingsInput } from '../../models/reminders.models';

export class UpsertReminderSettingsCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly settings: UpsertReminderSettingsInput,
  ) {
    super();
  }
}
