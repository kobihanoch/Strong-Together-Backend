import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { DueWorkoutReminderSqlRow } from '../push.db-types';

@Injectable()
export class FindDueWorkoutRemindersSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves eligible workout reminders due in the cron look-ahead window.
   *
   * @returns The reminders that should be added to the push queue.
   */
  async findDueWorkoutReminders(): Promise<DueWorkoutReminderSqlRow[]> {
    return this.dbService.sql<DueWorkoutReminderSqlRow[]>`
      SELECT
        user_id AS "userId",
        workout_schedule_id AS "workoutScheduleId",
        occurrence_date::TEXT AS "occurrenceDate",
        reminder_at AS "reminderAt",
        first_name AS "firstName",
        split_name AS "splitName"
      FROM
        cron_api.due_workout_reminders ()
    `;
  }
}
