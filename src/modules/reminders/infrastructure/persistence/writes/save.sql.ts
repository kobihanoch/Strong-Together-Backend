import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { ReminderSettingsSqlInput } from '../reminders.db-types';

@Injectable()
export class SaveSql {
  constructor(private readonly db: DBService) {}

  async save(settings: ReminderSettingsSqlInput): Promise<void> {
    await this.db.sql`
      INSERT INTO reminders.user_reminder_setting (user_id, reminder_enabled, time_zone)
      VALUES (identity.current_user_id (), ${settings.reminderEnabled}, ${settings.timeZone})
      ON CONFLICT (user_id) DO UPDATE
      SET reminder_enabled = EXCLUDED.reminder_enabled,
          time_zone = EXCLUDED.time_zone,
          updated_at = NOW()
    `;
  }
}
