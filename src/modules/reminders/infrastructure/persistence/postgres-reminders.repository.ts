import { Injectable } from '@nestjs/common';
import { UpdateTimeZoneSql } from './writes/update-time-zone.sql';
import { UpsertSettingsSql } from './writes/upsert-settings.sql';
import type { UpdateReminderTimeZoneInput, UpsertReminderSettingsInput } from '../../application/models/reminders.models';
import { RemindersRepository } from '../../application/ports/reminders.repository';

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresRemindersRepository implements RemindersRepository {
  public constructor(
    private readonly upsertSettingsSql: UpsertSettingsSql,
    private readonly updateTimeZoneSql: UpdateTimeZoneSql,
  ) {}
  upsertForUser(userId: string, settings: UpsertReminderSettingsInput): Promise<void> {
    return this.upsertSettingsSql.upsertSettings(userId, settings);
  }
  updateTimeZoneForUser(userId: string, settings: UpdateReminderTimeZoneInput): Promise<void> {
    return this.updateTimeZoneSql.updateTimeZone(userId, settings);
  }
}
