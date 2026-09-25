import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { WorkoutHistorySqlRow } from '../workout-tracking.db-types';

@Injectable()
export class FindWorkoutHistorySql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves exercise tracking maps.
   *
   * @param userId - The user identifier.
   * @param days - The days.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking maps result.
   */
  async findWorkoutHistory(userId: string, days: number = 45, tz: string = 'Asia/Jerusalem') {
    const [{ data }] = await this.dbService.sql<WorkoutHistorySqlRow[]>`
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
        all_workout_summaries AS (
          SELECT
            wsum.id AS id,
            ws.name AS split_name,
            (
              (
                wsum.workout_start_utc AT TIME ZONE ${tz}
              )
            ) AS workout_time_local,
            wsum.workout_start_utc AS workout_start_utc,
            wsum.workout_end_utc AS workout_end_utc
          FROM
            tracking.workout_summary wsum
            JOIN workout.workout_split ws ON ws.id = wsum.workout_split_id
          WHERE
            wsum.user_id = ${userId}::UUID
        ),
        bounded_workout_summaries AS (
          SELECT
            aws.id AS id,
            aws.split_name AS split_name,
            aws.workout_start_utc AS workout_start_utc,
            aws.workout_end_utc AS workout_end_utc,
            aws.workout_time_local AS workout_time_local,
            ROUND(
              EXTRACT(
                EPOCH
                FROM
                  (aws.workout_end_utc - aws.workout_start_utc)
              ) / 60
            )::INT AS duration_minutes,
            TO_CHAR(aws.workout_time_local::date, 'YYYY-MM-DD') AS workout_date_local_string
          FROM
            all_workout_summaries aws
          WHERE
            aws.workout_start_utc >= (
              SELECT
                lower_bound_utc
              FROM
                bounds
            )
            AND aws.workout_start_utc < (
              SELECT
                upper_bound_utc
              FROM
                bounds
            )
        ),
        duration_by_date AS (
          SELECT
            bws.workout_date_local_string,
            COALESCE(SUM(bws.duration_minutes), 0)::INT AS duration_minutes
          FROM
            bounded_workout_summaries bws
          GROUP BY
            bws.workout_date_local_string
        ),
        -- All exercise tracking
        all_exercise_trackings AS (
          SELECT
            -- For maps building
            bws.workout_date_local_string AS "workoutDate",
            et.exercise_to_split_id AS "exerciseToSplitId",
            et.split_name AS "splitName",
            et.order_index AS "orderIndex",
            JSONB_BUILD_OBJECT(
              'exerciseTrackingId',
              et.id::INT,
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
              'notes',
              et.notes,
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
            ) AS exercise_tracking_flat_payload
          FROM
            tracking.v_exercise_tracking_set_expanded et
            JOIN bounded_workout_summaries bws ON bws.id = et.workout_summary_id
          GROUP BY
            bws.workout_date_local_string,
            et.id,
            et.exercise_to_split_id,
            et.exercise_id,
            et.workout_split_id,
            et.split_name,
            et.exercise,
            et.order_index,
            et.target_muscle,
            et.specific_target_muscle,
            et.notes
          ORDER BY
            et.order_index ASC
        ),
        -- Maps
        by_date AS (
          SELECT
            COALESCE(
              JSON_OBJECT_AGG(
                workout_date_local_string,
                items
                ORDER BY
                  workout_date_local_string DESC
              ),
              '{}'::JSON
            ) AS map
          FROM
            (
              SELECT
                aet."workoutDate" AS workout_date_local_string,
                JSONB_BUILD_OBJECT(
                  'durationMins',
                  dbd.duration_minutes,
                  'exerciseTracked',
                  JSONB_AGG(
                    JSONB_BUILD_OBJECT('exerciseTracking', aet.exercise_tracking_flat_payload)
                    ORDER BY
                      aet."orderIndex" ASC
                  )
                ) AS items
              FROM
                all_exercise_trackings aet
                JOIN duration_by_date dbd ON dbd.workout_date_local_string = aet."workoutDate"
              GROUP BY
                aet."workoutDate",
                dbd.duration_minutes
            ) t
        )
      SELECT
        JSON_BUILD_OBJECT(
          'byDate',
          COALESCE(
            (
              SELECT
                bdm.map
              FROM
                by_date bdm
            ),
            '{}'::JSON
          )
        ) AS data
    `;

    return data;
  }
}
