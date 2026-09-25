import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/db/db.service';
import type { WorkoutStatisticsSqlResult, WorkoutStatisticsSqlRow } from '../workout-tracking.db-types';

@Injectable()
export class FindWorkoutStatisticsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves exercise tracking stats.
   *
   * @param userId - The user identifier.
   * @param days - The days.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking stats result.
   */
  async findWorkoutStatistics(userId: string, days: number = 45, tz: string = 'Asia/Jerusalem'): Promise<WorkoutStatisticsSqlResult> {
    const [{ data }] = await this.dbService.sql<WorkoutStatisticsSqlRow[]>`
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
            wsum.id,
            ws.name AS split_name,
            wsum.workout_start_utc AT TIME ZONE ${tz} AS workout_time_local,
            wsum.workout_start_utc
          FROM
            tracking.workout_summary wsum
            JOIN workout.workout_split ws ON ws.id = wsum.workout_split_id
          WHERE
            wsum.user_id = ${userId}::UUID
        ),
        bounded_workout_summaries AS (
          SELECT
            aws.id,
            aws.split_name,
            aws.workout_start_utc,
            aws.workout_time_local
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
        total_workouts AS (
          SELECT
            COUNT(aws.id)::INT AS workout_count
          FROM
            all_workout_summaries aws
        ),
        active_split_count AS (
          SELECT
            COUNT(ws.id)::INT AS count
          FROM
            workout.workout_split ws
            JOIN workout.workout_plan wp ON ws.workout_id = wp.id
          WHERE
            wp.user_id = ${userId}::UUID
            AND wp.is_active = TRUE
            AND ws.is_active = TRUE
        ),
        active_schedule_count AS (
          SELECT
            COUNT(schedule.id)::INT AS count
          FROM
            schedules.workout_schedule schedule
            JOIN workout.workout_split ws ON ws.id = schedule.workout_split_id
            JOIN workout.workout_plan wp ON wp.id = ws.workout_id
          WHERE
            schedule.user_id = ${userId}::UUID
            AND wp.user_id = schedule.user_id
            AND wp.is_active = TRUE
            AND ws.is_active = TRUE
        ),
        workouts_scheduled_per_week_count AS (
          SELECT
            CASE
              WHEN schedules.count > 0 THEN schedules.count
              ELSE splits.count
            END AS count
          FROM
            active_schedule_count schedules
            CROSS JOIN active_split_count splits
        ),
        workouts_count_this_week AS (
          SELECT
            COUNT(bws.id)::INT AS count
          FROM
            bounded_workout_summaries bws
          WHERE
            bws.workout_start_utc >= (
              DATE_TRUNC(
                'week',
                (NOW() AT TIME ZONE ${tz}) + INTERVAL '1 day'
              ) - INTERVAL '1 day'
            ) AT TIME ZONE ${tz}
        ),
        last_workout_date AS (
          SELECT
            aws.workout_time_local::date AS last_date
          FROM
            all_workout_summaries aws
          ORDER BY
            aws.workout_time_local DESC
          LIMIT
            1
        ),
        last_bounded_workout AS (
          SELECT
            bws.id AS last_id
          FROM
            bounded_workout_summaries bws
          ORDER BY
            bws.workout_time_local DESC
          LIMIT
            1
        ),
        last_workout_stats AS (
          SELECT
            COUNT(DISTINCT et.id)::INT AS exercise_tracked_count,
            COUNT(et.set_index)::INT AS set_tracked_count,
            bws.split_name
          FROM
            tracking.v_exercise_tracking_set_expanded et
            JOIN all_workout_summaries bws ON bws.id = et.workout_summary_id
          WHERE
            bws.id = (
              SELECT
                last_id
              FROM
                last_bounded_workout
            )
          GROUP BY
            bws.split_name
        ),
        latest_user_workout_summary AS (
          SELECT
            latest_split.order_index
          FROM
            tracking.workout_summary latest_summary
            JOIN workout.workout_split latest_split ON latest_split.id = latest_summary.workout_split_id
          WHERE
            latest_summary.user_id = ${userId}::UUID
          ORDER BY
            latest_summary.workout_start_utc DESC,
            latest_summary.id DESC
          LIMIT
            1
        ),
        next_split_by_order_index AS (
          SELECT
            ws.id::INT,
            ws.name,
            ws.order_index,
            workout.get_muscle_group (ws.id) AS muscle_group
          FROM
            workout.workout_split ws
            JOIN workout.workout_plan wp ON wp.id = ws.workout_id
          WHERE
            wp.user_id = ${userId}::UUID
            AND wp.is_active = TRUE
            AND ws.is_active = TRUE
          ORDER BY
            CASE
              WHEN NOT EXISTS (
                SELECT
                  1
                FROM
                  latest_user_workout_summary
              ) THEN 0
              WHEN ws.order_index > (
                SELECT
                  order_index
                FROM
                  latest_user_workout_summary
              ) THEN 0
              ELSE 1
            END,
            ws.order_index
          LIMIT
            1
        ),
        all_prs AS (
          SELECT
            COALESCE(
              JSONB_AGG(
                JSONB_BUILD_OBJECT(
                  'exerciseToSplitId',
                  p.exercise_to_split_id::INT,
                  'exerciseId',
                  p.exercise_id::INT,
                  'exerciseName',
                  p.exercise,
                  'prWeight',
                  p.weight,
                  'prReps',
                  p.reps::INT,
                  'prSetIndex',
                  p.set_index,
                  'estimatedOneRepMax',
                  (
                    CASE
                      WHEN p.reps = 1 THEN p.weight::NUMERIC
                      WHEN p.reps BETWEEN 2 AND 5  THEN (p.weight * (1 + 0.0333 * p.reps))::NUMERIC -- Epley
                      WHEN p.reps BETWEEN 6 AND 10  THEN (p.weight * 36.0 / (37.0 - p.reps))::NUMERIC -- Brzycki
                      WHEN p.reps BETWEEN 11 AND 12  THEN (p.weight * (1 + 0.025 * p.reps))::NUMERIC -- O'Connor
                      ELSE NULL
                    END
                  ),
                  'workoutStartLocal',
                  TO_CHAR(
                    p.workout_start_utc AT TIME ZONE ${tz},
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                  )
                )
                ORDER BY
                  p.workout_start_utc DESC,
                  p.weight DESC,
                  p.id DESC
              ),
              '[]'::JSONB
            ) AS all_prs_payload
          FROM
            (
              SELECT
                p.*
              FROM
                tracking.v_prs p
                JOIN all_workout_summaries aws ON p.workout_summary_id = aws.id
              WHERE
                p.exercise_id IS NOT NULL
              ORDER BY
                p.workout_start_utc DESC,
                p.weight DESC,
                p.id DESC
              LIMIT
                1
            ) p
        )
      SELECT
        JSONB_BUILD_OBJECT(
          'workoutCount',
          COALESCE(
            (
              SELECT
                workout_count
              FROM
                total_workouts
            ),
            0
          ),
          'hasExerciseTracking',
          EXISTS (
            SELECT
              1
            FROM
              bounded_workout_summaries
          ),
          'nextSplitByOrderIndex',
          (
            SELECT
              JSONB_BUILD_OBJECT(
                'id',
                nws.id,
                'name',
                nws.name,
                'orderIndex',
                nws.order_index,
                'muscleGroup',
                nws.muscle_group
              )
            FROM
              next_split_by_order_index nws
          ),
          'workoutTargets',
          JSONB_BUILD_OBJECT(
            'workoutCountThisWeek',
            COALESCE(
              (
                SELECT
                  count
                FROM
                  workouts_count_this_week
              ),
              0
            ),
            'workoutCountScheduledPerWeek',
            COALESCE(
              (
                SELECT
                  count
                FROM
                  workouts_scheduled_per_week_count
              ),
              0
            )
          ),
          'lastWorkoutStats',
          JSONB_BUILD_OBJECT(
            'workoutDate',
            TO_CHAR(
              (
                SELECT
                  last_date
                FROM
                  last_workout_date
              ),
              'YYYY-MM-DD'
            ),
            'workoutSplitName',
            (
              SELECT
                split_name
              FROM
                last_workout_stats
            ),
            'exerciseTrackedCount',
            COALESCE(
              (
                SELECT
                  exercise_tracked_count
                FROM
                  last_workout_stats
              ),
              0
            ),
            'setTrackedCount',
            COALESCE(
              (
                SELECT
                  set_tracked_count
                FROM
                  last_workout_stats
              ),
              0
            )
          ),
          'latestPr',
          COALESCE(
            (
              SELECT
                all_prs_payload
              FROM
                all_prs
            ),
            '[]'::JSONB
          )
        ) AS data
    `;

    return data;
  }
}
