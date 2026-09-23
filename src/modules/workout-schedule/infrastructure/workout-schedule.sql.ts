import { Injectable } from '@nestjs/common';
import type { WorkoutScheduleInput } from '../application/models/workout-schedule.models';
import { DBService } from '../../../infrastructure/db/db.service';
import type { ActiveWorkoutSplitCountSqlRow, WorkoutScheduleSqlRow } from './workout-schedule.db-types';

/** Executes workout-schedule SQL inside the active RLS transaction. */
@Injectable()
export class WorkoutScheduleSql {
  public constructor(private readonly dbService: DBService) {}

  /**
   * Executes the find by user SQL operation.
   *
   * @param userId - The user identifier.
   * @returns The query result.
   */
  public findByUser(userId: string): Promise<WorkoutScheduleSqlRow[]> {
    return this.dbService.sql<WorkoutScheduleSqlRow[]>`
      SELECT
        schedule.id,
        schedule.user_id AS "userId",
        schedule.workout_split_id::INT AS "workoutSplitId",
        schedule.day_of_week AS "dayOfWeek",
        schedule.start_time AS "startTime",
        schedule.created_at AS "createdAt",
        schedule.updated_at AS "updatedAt"
      FROM
        schedules.workout_schedule schedule
        JOIN workout.workout_split split ON split.id = schedule.workout_split_id
        JOIN workout.workout_plan plan ON plan.id = split.workout_id
      WHERE
        schedule.user_id = ${userId}::UUID
        AND plan.user_id = schedule.user_id
        AND plan.is_active = TRUE
        AND split.is_active = TRUE
      ORDER BY
        schedule.day_of_week,
        schedule.start_time,
        schedule.id
    `;
  }

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
