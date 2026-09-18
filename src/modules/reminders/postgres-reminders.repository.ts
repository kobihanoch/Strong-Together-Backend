import { Injectable } from '@nestjs/common';
import type { GetReminderSettingsResponse, UpdateReminderTimeZoneBody, UpsertReminderSettingsBody } from '@strong-together/shared';
import { RemindersQueries } from './reminders.queries';
import { RemindersRepository } from './reminders.repository';

@Injectable()
export class PostgresRemindersRepository implements RemindersRepository {
  constructor(private readonly queries: RemindersQueries) {}

  findReminderSettingsByUser(userId: string): Promise<GetReminderSettingsResponse['reminderSettings']> {
    return this.queries.queryGetReminderSettings(userId);
  }

  upsertReminderSettingsForUser(userId: string, settings: UpsertReminderSettingsBody): Promise<void> {
    return this.queries.queryUpsertReminderSettings(userId, settings);
  }

  updateReminderTimeZoneForUser(userId: string, settings: UpdateReminderTimeZoneBody): Promise<void> {
    return this.queries.queryUpdateReminderTimeZone(userId, settings);
  }
}
