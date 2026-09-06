import { Inject, Injectable } from '@nestjs/common';
import type { UpsertReminderSettingsBody } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

/**
 * Database operations for authenticated users' reminder settings.
 */
@Injectable()
export class RemindersQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Creates or replaces the reminder settings owned by a user.
   * @param userId - The authenticated user's identifier.
   * @param settings - The validated reminder settings.
   */
  async queryUpsertReminderSettings(userId: string, settings: UpsertReminderSettingsBody): Promise<void> {
    await this.sql`
      INSERT INTO
        reminders.user_reminder_setting (user_id, reminder_enabled, reminder_offset_minutes, time_zone)
      VALUES
        (
          ${userId}::UUID,
          ${settings.reminderEnabled},
          ${settings.reminderOffsetMinutes},
          ${settings.timeZone}
        )
      ON CONFLICT (user_id) DO UPDATE
      SET
        reminder_enabled = EXCLUDED.reminder_enabled,
        reminder_offset_minutes = EXCLUDED.reminder_offset_minutes,
        time_zone = EXCLUDED.time_zone,
        updated_at = NOW()
    `;
  }
}
