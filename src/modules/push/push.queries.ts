import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

export type DueWorkoutReminder = {
  userId: string;
  workoutScheduleId: string;
  occurrenceDate: string;
  reminderAt: Date;
  firstName: string;
  splitName: string;
};

@Injectable()
export class PushQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves eligible workout reminders due in the cron look-ahead window.
   * @returns The reminders that should be added to the push queue.
   */
  async queryDueWorkoutReminders(): Promise<DueWorkoutReminder[]> {
    return this.sql<DueWorkoutReminder[]>`
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
   * Retrieves the user's current Expo push token.
   * @param userId - The reminder owner's identifier.
   * @returns The current Expo token, or null when the user or token does not exist.
   */
  async queryExpoPushToken(userId: string): Promise<string | null> {
    const [row] = await this.sql<{ pushToken: string | null }[]>`
      SELECT cron_api.valid_workout_reminder_token(
        ${userId}::UUID
      ) AS "pushToken"
    `;

    return row?.pushToken ?? null;
  }
}
