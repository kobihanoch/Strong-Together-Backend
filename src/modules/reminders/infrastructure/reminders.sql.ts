import { Injectable } from '@nestjs/common';
import { DBService } from '../../../infrastructure/db/db.service';
import type { UpdateReminderTimeZoneInput, UpsertReminderSettingsInput } from '../application/models/reminders.models';
import type { ReminderSettingsSqlRow } from './reminders.db-types';

/**
 * Database operations for authenticated users' reminder settings.
 */
@Injectable()
export class RemindersSql {
  constructor(private readonly dbService: DBService) {}

  /**
   * Retrieves reminder settings owned by a user.
   *
   * @param userId - The authenticated user's identifier.
   * @returns The user's reminder settings, or null when none exist.
   */
  async findSettings(userId: string): Promise<ReminderSettingsSqlRow | null> {
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
        user_id = ${userId}::UUID
    `;

    return settings ?? null;
  }

  /**
   * Creates or replaces the reminder settings owned by a user.
   *
   * @param userId - The authenticated user's identifier.
   * @param settings - The validated reminder settings.
   * @returns A promise that resolves when the operation completes.
   */
  async upsertSettings(userId: string, settings: UpsertReminderSettingsInput): Promise<void> {
    await this.dbService.sql`
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

  /**
   * Updates only the time zone of reminder settings owned by a user.
   *
   * @param userId - The authenticated user's identifier.
   * @param settings - The validated reminder time-zone settings.
   * @returns A promise that resolves when the operation completes.
   */
  async updateTimeZone(userId: string, settings: UpdateReminderTimeZoneInput): Promise<void> {
    await this.dbService.sql`
      UPDATE reminders.user_reminder_setting
      SET
        time_zone = ${settings.timeZone},
        updated_at = NOW()
      WHERE
        user_id = ${userId}::UUID
    `;
  }
}
