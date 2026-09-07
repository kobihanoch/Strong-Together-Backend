import { Inject, Injectable } from '@nestjs/common';
import type { GetReminderSettingsResponse, UpsertReminderSettingsBody } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

/**
 * Database operations for authenticated users' reminder settings.
 */
@Injectable()
export class RemindersQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves reminder settings owned by a user.
   * @param userId - The authenticated user's identifier.
   * @returns The user's reminder settings, or null when none exist.
   */
  async queryGetReminderSettings(userId: string): Promise<GetReminderSettingsResponse['reminderSettings']> {
    const [settings] = await this.sql<NonNullable<GetReminderSettingsResponse['reminderSettings']>[]>`
      SELECT
        id,
        user_id AS "userId",
        reminder_enabled AS "reminderEnabled",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        time_zone AS "timeZone"
      FROM reminders.user_reminder_setting
      WHERE user_id = ${userId}::UUID
    `;

    return settings ?? null;
  }

  /**
   * Creates or replaces the reminder settings owned by a user.
   * @param userId - The authenticated user's identifier.
   * @param settings - The validated reminder settings.
   */
  async queryUpsertReminderSettings(userId: string, settings: UpsertReminderSettingsBody): Promise<void> {
    await this.sql`
      INSERT INTO
        reminders.user_reminder_setting (user_id, reminder_enabled, time_zone)
      VALUES
        (
          ${userId}::UUID,
          ${settings.reminderEnabled},
          ${settings.timeZone}
        )
      ON CONFLICT (user_id) DO UPDATE
      SET
        reminder_enabled = EXCLUDED.reminder_enabled,
        time_zone = EXCLUDED.time_zone,
        updated_at = NOW()
    `;
  }
}
