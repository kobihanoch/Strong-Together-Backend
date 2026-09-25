import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { WorkoutScheduleInput } from '../../../application/models/workout-schedule.models';
import type { ActiveWorkoutSplitCountSqlRow } from '../workout-schedule.db-types';

/** Executes workout-schedule SQL inside the active RLS transaction. */

@Injectable()
export class ReplaceForUserSql {
  public constructor(private readonly dbService: DBService) {}
  /**
   * Executes the replace for user SQL operation.
   *
   * @param userId - The user identifier.
   * @param schedules - The schedules value.
   * @returns The query result.
   */
  public async replaceForUser(userId: string, schedules: WorkoutScheduleInput[]): Promise<boolean> {
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
          AND plan.user_id = ${userId}::UUID
          AND plan.is_active = TRUE
          AND split.is_active = TRUE
      `;

      if (count !== splitIds.length) return false;
    }

    await this.dbService.sql`
      DELETE FROM schedules.workout_schedule
      WHERE
        user_id = ${userId}::UUID
    `;

    for (const schedule of schedules) {
      await this.dbService.sql`
        INSERT INTO
          schedules.workout_schedule (user_id, workout_split_id, day_of_week, start_time)
        VALUES
          (
            ${userId}::UUID,
            ${schedule.workoutSplitId},
            ${schedule.dayOfWeek},
            ${schedule.startTime}::TIME(0)
          )
      `;
    }

    return true;
  }
}
