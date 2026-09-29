import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { ActiveWorkoutSplitCountSqlRow, WorkoutScheduleSqlInput } from '../workout-schedule.db-types';

/** Executes workout-schedule SQL inside the active RLS transaction. */

@Injectable()
export class SaveSql {
  public constructor(private readonly dbService: DBService) {}
  /**
   * Executes the replace for user SQL operation.
   *
   * @param schedules - Persistence-ready schedule values.
   * @returns The query result.
   */
  public async save(schedules: WorkoutScheduleSqlInput[]): Promise<boolean> {
    const splitIds = [...new Set(schedules.map((schedule) => schedule.workoutSplitId))];

    if (splitIds.length > 0) {
      const [{ count }] = await this.dbService.sql<ActiveWorkoutSplitCountSqlRow[]>`
        SELECT
          COUNT(split.id)::INT AS count
        FROM
          workout.workout_split split
          JOIN workout.workout_plan plan ON plan.id = split.workout_id
        WHERE
          split.id = ANY (${splitIds}::BIGINT[])
          AND plan.user_id = identity.current_user_id ()
          AND plan.is_active = TRUE
          AND split.is_active = TRUE
      `;

      if (count !== splitIds.length) return false;
    }

    await this.dbService.sql`
      DELETE FROM schedules.workout_schedule
      WHERE
        user_id = identity.current_user_id ()
    `;

    if (schedules.length > 0) {
      const workoutSplitIds = schedules.map((schedule) => schedule.workoutSplitId);
      const daysOfWeek = schedules.map((schedule) => schedule.dayOfWeek);
      const startTimes = schedules.map((schedule) => schedule.startTime);

      await this.dbService.sql`
        INSERT INTO
          schedules.workout_schedule (user_id, workout_split_id, day_of_week, start_time)
        SELECT
          identity.current_user_id (),
          entries.workout_split_id,
          entries.day_of_week,
          entries.start_time::TIME(0)
        FROM
          UNNEST(
            ${workoutSplitIds}::BIGINT[],
            ${daysOfWeek}::SMALLINT[],
            ${startTimes}::TEXT[]
          ) AS entries (workout_split_id, day_of_week, start_time)
      `;
    }

    return true;
  }
}
