import { Injectable } from '@nestjs/common';
import type {
  GetReminderSettingsResponse,
  UpdateReminderTimeZoneBody,
  UpsertReminderSettingsBody,
} from '@strong-together/shared';
import { RemindersQueries } from './reminders.queries';

@Injectable()
export class RemindersService {
  constructor(private readonly remindersQueries: RemindersQueries) {}

  /**
   * Gets the authenticated user's reminder settings.
   * @param userId - The authenticated user's identifier.
   * @returns The user's reminder settings response.
   */
  async getReminderSettingsData(userId: string): Promise<GetReminderSettingsResponse> {
    const reminderSettings = await this.remindersQueries.queryGetReminderSettings(userId);
    return { reminderSettings };
  }

  /**
   * Creates or replaces the authenticated user's reminder settings.
   * @param userId - The authenticated user's identifier.
   * @param body - The validated reminder-settings payload.
   */
  async upsertReminderSettingsData(userId: string, body: UpsertReminderSettingsBody): Promise<void> {
    await this.remindersQueries.queryUpsertReminderSettings(userId, body);
  }

  /**
   * Updates only the time zone of the authenticated user's reminder settings.
   * @param userId - The authenticated user's identifier.
   * @param body - The validated reminder time-zone payload.
   */
  async updateReminderTimeZoneData(userId: string, body: UpdateReminderTimeZoneBody): Promise<void> {
    await this.remindersQueries.queryUpdateReminderTimeZone(userId, body);
  }
}
