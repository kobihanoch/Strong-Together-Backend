import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { WorkoutPlanSqlRow } from '../workout-plan.db-types';

/** Represents the existing workout split input value. */
@Injectable()
export class FindActiveByUserSql {
  constructor(private readonly dbService: DBService) {}

  // Return the complete active plan in the same shape used by clients for display and editing.
  /**
   * Whole user workout plan.
   *
   * @param userId - The user identifier.
   * @param tz - The IANA time-zone name.
   * @returns The whole user workout plan result.
   */
  async findActiveByUser(userId: string, tz: string) {
    return this.dbService.sql<WorkoutPlanSqlRow[]>`
      WITH
        ranked_workout_durations AS (
          SELECT
            summaries.workout_split_id,
            EXTRACT(
              EPOCH
              FROM
                (summaries.workout_end_utc - summaries.workout_start_utc)
            ) / 60 AS duration_minutes,
            ROW_NUMBER() OVER (
              PARTITION BY
                summaries.workout_split_id
              ORDER BY
                summaries.workout_start_utc DESC
            ) AS recency_rank
          FROM
            tracking.workout_summary summaries
            JOIN workout.workout_split duration_split ON duration_split.id = summaries.workout_split_id
          WHERE
            summaries.user_id = ${userId}::UUID
            AND summaries.workout_start_utc >= duration_split.updated_at
            AND summaries.workout_end_utc > summaries.workout_start_utc
            AND summaries.workout_end_utc - summaries.workout_start_utc <= INTERVAL '4 hours'
        ),
        split_duration_estimates AS (
          SELECT
            durations.workout_split_id,
            ROUND(
              PERCENTILE_CONT(0.5) WITHIN GROUP (
                ORDER BY
                  durations.duration_minutes
              )
            )::INT AS estimated_duration_minutes
          FROM
            ranked_workout_durations durations
          WHERE
            durations.recency_rank <= 10
          GROUP BY
            durations.workout_split_id
        )
      SELECT
        workoutplans.id::INT,
        workout.get_number_of_splits (workoutplans.id)::INT AS "numberOfSplits",
        workoutplans.created_at AS "createdAt",
        workoutplans.user_id AS "userId",
        workoutplans.is_active AS "isActive",
        (
          workoutplans.updated_at AT TIME ZONE ${tz}
        ) AS "updatedAt",
        (
          SELECT
            COALESCE(
              JSON_AGG(
                JSONB_BUILD_OBJECT(
                  'id',
                  workoutsplits.id,
                  'workoutId',
                  workoutsplits.workout_id,
                  'name',
                  workoutsplits.name,
                  'orderIndex',
                  workoutsplits.order_index,
                  'createdAt',
                  workoutsplits.created_at,
                  'isActive',
                  workoutsplits.is_active,
                  'muscleGroup',
                  workout.get_muscle_group (workoutsplits.id),
                  'estimatedDurationMinutes',
                  duration_estimates.estimated_duration_minutes,
                  'exercises',
                  (
                    SELECT
                      COALESCE(
                        JSON_AGG(
                          JSONB_BUILD_OBJECT(
                            'exerciseToSplitId',
                            ews.id,
                            'exerciseId',
                            ews.exercise_id,
                            'name',
                            ews.exercise,
                            'sets',
                            ews.sets,
                            'orderIndex',
                            ews.order_index,
                            'isActive',
                            ews.is_active,
                            'targetMuscle',
                            ex.target_muscle,
                            'specificTargetMuscle',
                            ex.specific_target_muscle
                          )
                          ORDER BY
                            ews.order_index
                        ),
                        '[]'::JSON
                      )
                    FROM
                      (
                        SELECT
                          expanded.id,
                          expanded.workout_split_id,
                          expanded.exercise_id,
                          expanded.exercise,
                          expanded.order_index,
                          expanded.is_active,
                          COALESCE(
                            JSONB_AGG(
                              JSONB_BUILD_OBJECT('orderIndex', expanded.set_index, 'reps', expanded.reps)
                              ORDER BY
                                expanded.set_index
                            ) FILTER (
                              WHERE
                                expanded.reps IS NOT NULL
                            ),
                            '[]'::JSONB
                          ) AS sets
                        FROM
                          workout.v_exercise_to_workout_split_set_expanded AS expanded
                        WHERE
                          expanded.is_active = TRUE
                        GROUP BY
                          expanded.id,
                          expanded.workout_split_id,
                          expanded.exercise_id,
                          expanded.exercise,
                          expanded.order_index,
                          expanded.is_active
                      ) AS ews
                      LEFT JOIN workout.exercise ex ON ex.id = ews.exercise_id
                    WHERE
                      ews.workout_split_id = workoutsplits.id
                  )
                )
                ORDER BY
                  workoutsplits.order_index
              ),
              '[]'::JSON
            )
          FROM
            workout.workout_split AS workoutsplits
            LEFT JOIN split_duration_estimates duration_estimates ON duration_estimates.workout_split_id = workoutsplits.id
          WHERE
            workoutsplits.workout_id = workoutplans.id
            AND workoutsplits.is_active = TRUE
        ) AS "workoutSplits"
      FROM
        workout.workout_plan AS workoutplans
      WHERE
        workoutplans.user_id = ${userId}::UUID
        AND workoutplans.is_active = TRUE
      LIMIT
        1;
    `;
  }

  // Save a complete plan snapshot: IDs update existing splits, while missing IDs create new splits.
}
