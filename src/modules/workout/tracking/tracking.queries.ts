import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import type {
  ExerciseTrackingIdQueryDto,
  ExerciseHistoryQueryDto,
  ExerciseHistoryRowQueryDto,
  ExerciseTrackingMapsQueryDto,
  ExerciseTrackingMapsRowQueryDto,
  ExerciseTrackingStatsQueryDto,
  ExerciseTrackingStatsRowQueryDto,
  FinishedWorkoutEntryQueryDto,
  WorkoutSplitLookupQueryDto,
  WorkoutSummaryIdQueryDto,
} from '@strong-together/shared';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class WorkoutTrackingQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves exercise tracking maps.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking maps result.
   */
  async queryGetExerciseTrackingMaps(userId: string, days: number = 45, tz: string = 'Asia/Jerusalem'): Promise<ExerciseTrackingMapsQueryDto> {
    const [{ data }] = await this.sql<ExerciseTrackingMapsRowQueryDto[]>`
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
            analytics.v_exercise_tracking_set_expanded et
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
                ORDER BY workout_date_local_string DESC
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
  async queryGetExerciseHistory(
    userId: string,
    days: number = 45,
    tz: string = 'Asia/Jerusalem',
  ): Promise<ExerciseHistoryQueryDto> {
    const [{ data }] = await this.sql<ExerciseHistoryRowQueryDto[]>`
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
                  ORDER BY et.set_index ASC
                ) FILTER (WHERE et.set_index IS NOT NULL),
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
            analytics.v_exercise_tracking_set_expanded et
            JOIN tracking.workout_summary wsum ON wsum.id = et.workout_summary_id
          WHERE
            wsum.user_id = ${userId}::UUID
            AND et.exercise_to_split_id IS NOT NULL
            AND wsum.workout_start_utc >= (SELECT lower_bound_utc FROM bounds)
            AND wsum.workout_start_utc < (SELECT upper_bound_utc FROM bounds)
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
            COALESCE(JSONB_OBJECT_AGG("exerciseToSplitId"::TEXT, items), '{}'::JSONB) AS map
          FROM
            (
              SELECT
                "exerciseToSplitId",
                JSONB_BUILD_OBJECT(
                  'exerciseTracked',
                  JSONB_AGG(payload ORDER BY "workoutStartUtc" DESC, "exerciseTrackingId" DESC)
                ) AS items
              FROM exercise_trackings
              GROUP BY "exerciseToSplitId"
            ) grouped
        )
      SELECT JSONB_BUILD_OBJECT(
        'byExerciseToSplitId',
        COALESCE((SELECT map FROM by_exercise_to_split_id), '{}'::JSONB)
      ) AS data
    `;

    return data;
  }

  /**
   * Retrieves exercise tracking stats.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param tz - The IANA time-zone name.
   * @returns The exercise tracking stats result.
   */
  async queryGetExerciseTrackingStats(userId: string, days: number = 45, tz: string = 'Asia/Jerusalem'): Promise<ExerciseTrackingStatsQueryDto> {
    const [{ data }] = await this.sql<ExerciseTrackingStatsRowQueryDto[]>`
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
        workouts_scheduled_per_week_count AS (
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
        qualifying_weeks AS (
          SELECT
            DATE_TRUNC(
              'week',
              (
                aws.workout_start_utc AT TIME ZONE ${tz}
              ) + INTERVAL '1 day'
            ) - INTERVAL '1 day' AS week_start
          FROM
            all_workout_summaries aws
          WHERE
            aws.workout_start_utc < (
              SELECT
                upper_bound_utc
              FROM
                bounds
            )
          GROUP BY
            1
          HAVING
            COUNT(aws.id) >= (
              SELECT
                count
              FROM
                workouts_scheduled_per_week_count
            )
            AND (
              SELECT
                count
              FROM
                workouts_scheduled_per_week_count
            ) > 0
        ),
        streak_anchor AS (
          SELECT
            CASE
              WHEN EXISTS (
                SELECT
                  1
                FROM
                  qualifying_weeks qw
                WHERE
                  qw.week_start = current_week.week_start
              ) THEN current_week.week_start
              ELSE current_week.week_start - INTERVAL '1 week'
            END AS week_start
          FROM
            (
              SELECT
                DATE_TRUNC(
                  'week',
                  (NOW() AT TIME ZONE ${tz}) + INTERVAL '1 day'
                ) - INTERVAL '1 day' AS week_start
            ) current_week
        ),
        weeks_fits_minimum_scheduled_workouts AS (
          SELECT
            COUNT(*)::INT AS count
          FROM
            (
              SELECT
                qw.week_start,
                ROW_NUMBER() OVER (
                  ORDER BY
                    qw.week_start DESC
                ) AS streak_position
              FROM
                qualifying_weeks qw
              WHERE
                qw.week_start <= (
                  SELECT
                    week_start
                  FROM
                    streak_anchor
                )
            ) ranked_weeks
          WHERE
            week_start = (
              SELECT
                week_start
              FROM
                streak_anchor
            ) - (streak_position - 1) * INTERVAL '1 week'
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
            analytics.v_exercise_tracking_set_expanded et
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
        next_workout_split AS (
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
            analytics.v_prs p
            JOIN all_workout_summaries aws ON p.workout_summary_id = aws.id
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
          'nextWorkoutSplit',
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
              next_workout_split nws
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
            ),
            'weekStreak',
            COALESCE(
              (
                SELECT
                  count
                FROM
                  weeks_fits_minimum_scheduled_workouts
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
          'prs',
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

  /**
   * Inserts user finished workout.
   * @param userId - The user identifier.
   * @param workoutArray - The completed workout records.
   * @param workoutStartUtc - The workout start utc.
   * @param workoutEndUtc - The workout end utc.
   * @returns The insert user finished workout result.
   */
  async queryInsertUserFinishedWorkout(
    userId: string,
    workoutArray: FinishedWorkoutEntryQueryDto[],
    workoutStartUtc: string | null,
    workoutEndUtc: string | null,
  ): Promise<string> {
    // Resolve the workout split that owns the exercises in the finished workout.
    const firstAssignedExercise = workoutArray.find((exercise) => exercise.isExerciseAssignedToSplit);
    const [{ workoutSplitId }] = await this.sql<WorkoutSplitLookupQueryDto[]>`
      SELECT
        workout_split_id AS "workoutSplitId"
      FROM
        workout.exercise_to_workout_split
      WHERE
        id = ${firstAssignedExercise?.exerciseToSplitId ?? null}
      LIMIT
        1;
    `;

    // Create the parent summary for the completed workout.
    const [{ id: workoutSummaryId }] = await this.sql<WorkoutSummaryIdQueryDto[]>`
      INSERT INTO
        tracking.workout_summary (
          user_id,
          workout_start_utc,
          workout_end_utc,
          workout_split_id
        )
      VALUES
        (
          ${userId}::UUID,
          ${workoutStartUtc}::TIMESTAMPTZ,
          ${workoutEndUtc}::TIMESTAMPTZ,
          ${workoutSplitId}::int8
        )
      RETURNING
        id;
    `;

    for (const exercise of workoutArray) {
      // Create one tracking record for this exercise; its sets are inserted next.
      const [{ id: exerciseTrackingId }] = await this.sql<ExerciseTrackingIdQueryDto[]>`
        INSERT INTO
          tracking.exercise_tracking (
            exercise_to_split_id,
            exercise_id,
            notes,
            workout_summary_id
          )
        VALUES
          (
            ${exercise.isExerciseAssignedToSplit ? exercise.exerciseToSplitId : null},
            ${exercise.isExerciseAssignedToSplit ? null : exercise.exerciseId},
            ${exercise.notes ?? ''},
            ${workoutSummaryId}::UUID
          )
        RETURNING
          id;
      `;

      for (const trackedSet of exercise.trackedSets) {
        // Store the reps and weight for one performed set at its zero-based index.
        await this.sql`
          INSERT INTO
            tracking.tracking_set (exercise_tracking_id, set_index, reps, weight)
          VALUES
            (
              ${exerciseTrackingId},
              ${trackedSet.setIndex},
              ${trackedSet.reps},
              ${trackedSet.weight}
            );
        `;
      }
    }

    return workoutSummaryId;
  }
}
