import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';

/**
 * Database operations for authenticated users' reminder settings.
 */

@Injectable()
export class UpsertSettingsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Creates or replaces the reminder settings owned by a user.
   *
   * @param userId - The authenticated user's identifier.
   * @param settings - The validated reminder settings.
   * @returns A promise that resolves when the operation completes.
   */
  async upsertSettings(userId: string, settings: { reminderEnabled: boolean; timeZone: string }) {
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
}
