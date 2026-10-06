import { Command, type ICommand } from '@nestjs/cqrs';
import type { UpdateReminderTimeZoneInput } from '../../models/reminders.models';

export class UpdateReminderTimeZoneCommand extends Command<void> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly settings: UpdateReminderTimeZoneInput,
  ) {
    super();
  }
}
