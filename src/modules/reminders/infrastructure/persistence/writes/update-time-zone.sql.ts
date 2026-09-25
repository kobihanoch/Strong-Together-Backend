import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { UpdateReminderTimeZoneInput } from '../../../application/models/reminders.models';

/**
 * Database operations for authenticated users' reminder settings.
 */

@Injectable()
export class UpdateTimeZoneSql {
  constructor(private readonly dbService: DBService) {}
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
