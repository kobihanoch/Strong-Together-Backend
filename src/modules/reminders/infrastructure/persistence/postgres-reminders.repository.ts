import { Injectable } from '@nestjs/common';
import { UpdateTimeZoneSql } from './writes/update-time-zone.sql';
import { UpsertSettingsSql } from './writes/upsert-settings.sql';
import { RemindersRepository } from '../../application/ports/reminders.repository';
import type { ReminderSettingsPreference } from '../../domain/entities/reminder-settings';
import type { ReminderTimeZone } from '../../domain/value-objects/reminder-time-zone';

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresRemindersRepository implements RemindersRepository {
  public constructor(
    private readonly upsertSettingsSql: UpsertSettingsSql,
    private readonly updateTimeZoneSql: UpdateTimeZoneSql,
  ) {}
  upsertForUser(userId: string, settings: ReminderSettingsPreference): Promise<void> {
    return this.upsertSettingsSql.upsertSettings(userId, {
      reminderEnabled: settings.reminderEnabled,
      timeZone: settings.timeZone.value,
    });
  }
  updateTimeZoneForUser(userId: string, timeZone: ReminderTimeZone): Promise<void> {
    return this.updateTimeZoneSql.updateTimeZone(userId, { timeZone: timeZone.value });
  }
}
