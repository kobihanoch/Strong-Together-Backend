import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/db/db.service';
import type { WorkoutScheduleSqlRow } from '../workout-schedule.db-types';

/** Executes workout-schedule SQL inside the active RLS transaction. */

@Injectable()
export class FindByUserSql {
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
}
