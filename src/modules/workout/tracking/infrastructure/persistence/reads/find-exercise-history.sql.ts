import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { ExerciseHistorySqlResult, ExerciseHistorySqlRow } from '../workout-tracking.db-types';

@Injectable()
export class FindExerciseHistorySql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves tracking history grouped by exercise assignment.
   *
   * Each assignment's tracking entries omit notes and the `exerciseTracking`
   * wrapper, include the timezone-adjusted local start time, and are ordered
   * by workout time descending.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent calendar days to include.
   * @param tz - The IANA time-zone name used to calculate date boundaries.
   * @returns Exercise tracking grouped by exercise-to-split identifier.
   */
  async findExerciseHistory(userId: string, days: number = 45, tz: string = 'Asia/Jerusalem'): Promise<ExerciseHistorySqlResult> {
    const [{ data }] = await this.dbService.sql<ExerciseHistorySqlRow[]>`
      WITH
        bounds AS (
          SELECT
            (
              (NOW() AT TIME ZONE ${tz})::date - GREATEST(${days} - 1, 0) * INTERVAL '1 day'
            ) AT TIME ZONE ${tz} AS lower_bound_utc,
            (
              (NOW() AT TIME ZONE ${tz})::date + INTERVAL '1 day'
            ) AT TIME ZONE ${tz} AS upper_bound_utc
        ),
        exercise_trackings AS (
          SELECT
            et.exercise_to_split_id AS "exerciseToSplitId",
            et.workout_start_utc AS "workoutStartUtc",
            et.id AS "exerciseTrackingId",
            JSONB_BUILD_OBJECT(
              'exerciseTrackingId',
              et.id::INT,
              'workoutStartLocal',
              TO_CHAR(
                et.workout_start_utc AT TIME ZONE ${tz},
                'YYYY-MM-DD"T"HH24:MI:SS.MS'
              ),
              'sets',
              COALESCE(
                JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                    'setIndex',
                    et.set_index,
                    'weight',
                    et.weight,
                    'reps',
                    et.reps::INT
                  )
                  ORDER BY
                    et.set_index ASC
                ) FILTER (
                  WHERE
                    et.set_index IS NOT NULL
                ),
                '[]'::JSONB
              ),
              'exerciseAssignment',
              JSONB_BUILD_OBJECT(
                'exerciseToSplitId',
                et.exercise_to_split_id::INT,
                'orderIndex',
                et.order_index,
                'exerciseId',
                et.exercise_id::INT,
                'workoutSplitId',
                et.workout_split_id::INT,
                'workoutSplitName',
                et.split_name,
                'exerciseName',
                et.exercise,
                'targetMuscle',
                et.target_muscle,
                'specificTargetMuscle',
                et.specific_target_muscle
              )
            ) AS payload
          FROM
            tracking.v_exercise_tracking_set_expanded et
            JOIN tracking.workout_summary wsum ON wsum.id = et.workout_summary_id
          WHERE
            wsum.user_id = ${userId}::UUID
            AND et.exercise_to_split_id IS NOT NULL
            AND wsum.workout_start_utc >= (
              SELECT
                lower_bound_utc
              FROM
                bounds
            )
            AND wsum.workout_start_utc < (
              SELECT
                upper_bound_utc
              FROM
                bounds
            )
          GROUP BY
            et.id,
            et.exercise_to_split_id,
            et.exercise_id,
            et.workout_split_id,
            et.split_name,
            et.exercise,
            et.order_index,
            et.target_muscle,
            et.specific_target_muscle,
            et.notes,
            et.workout_start_utc
        ),
        by_exercise_to_split_id AS (
          SELECT
            COALESCE(
              JSONB_OBJECT_AGG("exerciseToSplitId"::TEXT, items),
              '{}'::JSONB
            ) AS map
          FROM
            (
              SELECT
                "exerciseToSplitId",
                JSONB_BUILD_OBJECT(
                  'exerciseTracked',
                  JSONB_AGG(
                    payload
                    ORDER BY
                      "workoutStartUtc" DESC,
                      "exerciseTrackingId" DESC
                  )
                ) AS items
              FROM
                exercise_trackings
              GROUP BY
                "exerciseToSplitId"
            ) grouped
        )
      SELECT
        JSONB_BUILD_OBJECT(
          'byExerciseToSplitId',
          COALESCE(
            (
              SELECT
                map
              FROM
                by_exercise_to_split_id
            ),
            '{}'::JSONB
          )
        ) AS data
    `;

    return data;
  }
}
