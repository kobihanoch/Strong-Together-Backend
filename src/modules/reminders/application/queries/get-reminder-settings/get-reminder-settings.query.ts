import { Query, type IQuery } from '@nestjs/cqrs';

import type { ReminderSettingsResult } from '../../models/reminders.models';
export class GetReminderSettingsQuery extends Query<ReminderSettingsResult> implements IQuery {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
