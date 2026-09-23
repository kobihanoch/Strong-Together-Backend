import { Injectable } from '@nestjs/common';
import type { ReminderSettings, UpdateReminderTimeZoneInput, UpsertReminderSettingsInput } from '../application/models/reminders.models';
import { RemindersRepository } from '../application/ports/reminders.repository';
import { RemindersSql } from './reminders.sql';

@Injectable()
export class PostgresRemindersRepository implements RemindersRepository {
  constructor(private readonly sql: RemindersSql) {}

  findByUser(userId: string): Promise<ReminderSettings | null> {
    return this.sql.findSettings(userId);
  }

  upsertForUser(userId: string, settings: UpsertReminderSettingsInput): Promise<void> {
    return this.sql.upsertSettings(userId, settings);
  }

  updateTimeZoneForUser(userId: string, settings: UpdateReminderTimeZoneInput): Promise<void> {
    return this.sql.updateTimeZone(userId, settings);
  }
}
