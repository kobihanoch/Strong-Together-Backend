import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { ReminderSettingsSqlRow } from '../reminders.db-types';

/**
 * Database operations for authenticated users' reminder settings.
 */

@Injectable()
export class FindSettingsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves reminder settings owned by a user.
   *
   * @returns The user's reminder settings, or undefined when none exist.
   */
  async findSettings() {
    const [settings] = await this.dbService.sql<ReminderSettingsSqlRow[]>`
      SELECT
        id,
        user_id AS "userId",
        reminder_enabled AS "reminderEnabled",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        time_zone AS "timeZone"
      FROM
        reminders.user_reminder_setting
      WHERE
        user_id = identity.current_user_id ()
    `;

    return settings;
  }
}
