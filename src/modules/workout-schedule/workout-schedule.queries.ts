import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { WorkoutScheduleInputDto, WorkoutScheduleQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

/**
 * Database operations for authenticated users' weekly workout schedules.
 */
@Injectable()
export class WorkoutScheduleQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves schedule rows attached to active splits in the user's active plan.
   * @param userId - The authenticated user's identifier.
   * @returns The user's active workout schedules in weekday and time order.
   */
  async queryWorkoutSchedules(userId: string): Promise<WorkoutScheduleQueryDto[]> {
    return this.sql<WorkoutScheduleQueryDto[]>`
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
   * Replaces all of the user's schedule rows with the submitted weekly schedule.
   * @param userId - The authenticated user's identifier.
   * @param schedules - The complete desired weekly schedule.
   */
  async queryReplaceWorkoutSchedules(userId: string, schedules: WorkoutScheduleInputDto[]): Promise<void> {
    const splitIds = [...new Set(schedules.map((schedule) => schedule.workoutSplitId))];

    if (splitIds.length > 0) {
      const [{ count }] = await this.sql<{ count: number }[]>`
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

      if (count !== splitIds.length) {
        throw new BadRequestException('Every scheduled workout split must be active and belong to the active plan');
      }
    }

    await this.sql`
      DELETE FROM schedules.workout_schedule
      WHERE
        user_id = ${userId}::UUID
    `;

    for (const schedule of schedules) {
      await this.sql`
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
  }
}
