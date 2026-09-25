import { Injectable } from '@nestjs/common';
import { FindSettingsSql } from './reads/find-settings.sql';
import type { ReminderSettings } from '../../application/models/reminders.models';
import { RemindersQueries } from '../../application/ports/reminders.queries';

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresRemindersQueries implements RemindersQueries {
  public constructor(private readonly findSettingsSql: FindSettingsSql) {}
  findByUser(userId: string): Promise<ReminderSettings | null> {
    return this.findSettingsSql.findSettings(userId);
  }
}
