import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { ReminderSettingsDomainSqlRow } from '../reminders.db-types';

@Injectable()
export class FindByUserForUpdateSql {
  constructor(private readonly db: DBService) {}

  async findByUserForUpdate(userId: string): Promise<ReminderSettingsDomainSqlRow | undefined> {
    const [settings] = await this.db.sql<ReminderSettingsDomainSqlRow[]>`
      SELECT user_id AS "userId", reminder_enabled AS "reminderEnabled", time_zone AS "timeZone"
      FROM reminders.user_reminder_setting
      WHERE user_id = ${userId}::UUID
      FOR UPDATE
    `;
    return settings;
  }
}
