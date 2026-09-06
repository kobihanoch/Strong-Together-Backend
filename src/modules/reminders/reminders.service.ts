import { Injectable } from '@nestjs/common';
import type { UpsertReminderSettingsBody } from '@strong-together/shared';
import { RemindersQueries } from './reminders.queries';

@Injectable()
export class RemindersService {
  constructor(private readonly remindersQueries: RemindersQueries) {}

  /**
   * Creates or replaces the authenticated user's reminder settings.
   * @param userId - The authenticated user's identifier.
   * @param body - The validated reminder-settings payload.
   */
  async upsertReminderSettingsData(userId: string, body: UpsertReminderSettingsBody): Promise<void> {
    await this.remindersQueries.queryUpsertReminderSettings(userId, body);
  }
}
