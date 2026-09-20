import { Injectable } from '@nestjs/common';
import { DBService } from '../../../infrastructure/db/db.service';
import type { DueWorkoutReminderSqlRow, EligiblePushTokenSqlRow } from './push.db-types';

@Injectable()
export class PushSql {
  constructor(private readonly dbService: DBService) {}

  /**
   * Retrieves eligible workout reminders due in the cron look-ahead window.
   * @returns The reminders that should be added to the push queue.
   */
  async queryDueWorkoutReminders(): Promise<DueWorkoutReminderSqlRow[]> {
    return this.dbService.sql<DueWorkoutReminderSqlRow[]>`
      SELECT
        user_id AS "userId",
        workout_schedule_id AS "workoutScheduleId",
        occurrence_date::TEXT AS "occurrenceDate",
        reminder_at AS "reminderAt",
        first_name AS "firstName",
        split_name AS "splitName"
      FROM cron_api.due_workout_reminders()
    `;
  }

  /**
   * Retrieves the user's current Expo push token when the queued reminder is still eligible.
   * @param userId - The reminder owner's identifier.
   * @param workoutScheduleId - The queued schedule identifier.
   * @param occurrenceDate - The queued local workout date.
   * @returns The current Expo token, or null when the delayed reminder is no longer eligible.
   */
  async queryExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null> {
    const [row] = await this.dbService.sql<EligiblePushTokenSqlRow[]>`
      SELECT cron_api.valid_workout_reminder_token(
        ${userId}::UUID,
        ${workoutScheduleId}::UUID,
        ${occurrenceDate}::DATE
      ) AS "pushToken"
    `;

    return row?.pushToken ?? null;
  }
}
