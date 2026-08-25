import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import type {
  ExerciseTrackingAndStatsQueryDto,
  ExerciseTrackingAndStatsRowQueryDto,
  ExerciseTrackingIdQueryDto,
  FinishedWorkoutEntryQueryDto,
  WorkoutSplitLookupQueryDto,
  WorkoutSummaryIdQueryDto,
} from '@strong-together/shared';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class WorkoutTrackingQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryGetExerciseTrackingAndStats(
    userId: string,
    days: number = 45,
    tz: string = 'Asia/Jerusalem',
  ): Promise<ExerciseTrackingAndStatsQueryDto> {
    // Load the user's tracking history, statistics, PRs, and response maps in one query.
    const [{ data }] = await this.sql<ExerciseTrackingAndStatsRowQueryDto[]>`
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
            TO_CHAR(aws.workout_time_local::date, 'YYYY-MM-DD') AS workout_date_local_string
          FROM
            all_workout_summaries aws
          WHERE
            aws.workout_start_utc >= (SELECT lower_bound_utc FROM bounds)
            AND aws.workout_start_utc < (SELECT upper_bound_utc FROM bounds)
        ),
        -- Total workouts counter
        total_workouts AS (
          SELECT
            COUNT(aws.id)::int AS workout_count
          FROM
            all_workout_summaries aws
        ),
        -- This week workout metrics and week streak
        workouts_scheduled_per_week_count AS (
          SELECT
            COUNT(ws.id)::int AS count
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
            DATE_TRUNC('week', (aws.workout_start_utc AT TIME ZONE ${tz}) + INTERVAL '1 day')
              - INTERVAL '1 day' AS week_start
          FROM
            all_workout_summaries aws
          WHERE
            aws.workout_start_utc < (SELECT upper_bound_utc FROM bounds)
          GROUP BY
            1
          HAVING
            COUNT(aws.id) >= (
              SELECT wschpw.count FROM workouts_scheduled_per_week_count wschpw
            )
            AND (
              SELECT wschpw.count FROM workouts_scheduled_per_week_count wschpw
            ) > 0
        ),
        streak_anchor AS (
          SELECT
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM qualifying_weeks qw
                WHERE qw.week_start = current_week.week_start
              ) THEN current_week.week_start
              ELSE current_week.week_start - INTERVAL '1 week'
            END AS week_start
          FROM
            (
              SELECT
                DATE_TRUNC('week', (NOW() AT TIME ZONE ${tz}) + INTERVAL '1 day')
                  - INTERVAL '1 day' AS week_start
            ) current_week
        ),
        weeks_fits_minimum_scheduled_workouts AS (
          SELECT
            COUNT(*)::int AS count
          FROM
            (
              SELECT
                qw.week_start,
                ROW_NUMBER() OVER (ORDER BY qw.week_start DESC) AS streak_position
              FROM
                qualifying_weeks qw
              WHERE
                qw.week_start <= (SELECT week_start FROM streak_anchor)
            ) ranked_weeks
          WHERE
            week_start = (SELECT week_start FROM streak_anchor)
              - (streak_position - 1) * INTERVAL '1 week'
        ),
        workouts_count_this_week AS (
          SELECT
            COUNT(bws.id)::int AS count
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
        -- Last workout metrics
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
            COUNT(DISTINCT et.id)::int AS exercise_tracked_count,
            COUNT(et.set_index)::int AS set_tracked_count,
            bws.split_name AS split_name
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
        -- PRS
        all_prs AS (
          SELECT
            COALESCE(
              JSONB_AGG(
                JSONB_BUILD_OBJECT(
                  'exerciseToSplitId',
                  p.exercise_to_split_id::int,
                  'exerciseId',
                  p.exercise_id::int,
                  'exerciseName',
                  p.exercise,
                  'prWeight',
                  p.weight,
                  'prReps',
                  p.reps::int,
                  'prSetIndex',
                  p.set_index
                )
                ORDER BY
                  p.workout_start_utc DESC
              ),
              '[]'::JSONB
            ) AS all_prs_payload
          FROM
            analytics.v_prs p
            JOIN all_workout_summaries aws ON p.workout_summary_id = aws.id
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
              'exerciseTracking',
              JSONB_BUILD_OBJECT(
                'exerciseTrackingId',
                et.id::int,
                'sets',
                COALESCE(
                  JSONB_AGG(
                    JSONB_BUILD_OBJECT(
                      'setIndex',
                      et.set_index,
                      'weight',
                      et.weight,
                      'reps',
                      et.reps::int
                    )
                    ORDER BY
                      et.set_index ASC
                  ) FILTER (WHERE et.set_index IS NOT NULL),
                  '[]'::JSONB
                ),
                'notes',
                et.notes,
                'exerciseAssignment',
                JSONB_BUILD_OBJECT(
                  'exerciseToSplitId',
                  et.exercise_to_split_id::int,
                  'orderIndex',
                  et.order_index,
                  'exerciseId',
                  et.exercise_id::int,
                  'workoutSplitId',
                  et.workout_split_id::int,
                  'workoutSplitName',
                  et.split_name,
                  'exerciseName',
                  et.exercise,
                  'targetMuscle',
                  et.target_muscle,
                  'specificTargetMuscle',
                  et.specific_target_muscle
                )
              )
            ) AS exercise_tracking_payload
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
              JSONB_OBJECT_AGG(workout_date_local_string, items),
              '{}'::JSONB
            ) AS map
          FROM
            (
              SELECT
                aet."workoutDate" AS workout_date_local_string,
                JSONB_AGG(
                  aet.exercise_tracking_payload
                  ORDER BY
                    aet."orderIndex" ASC
                ) AS items
              FROM
                all_exercise_trackings aet
              GROUP BY
                aet."workoutDate"
            ) t
        ),
        by_etsid AS (
          SELECT
            COALESCE(
              JSONB_OBJECT_AGG("exerciseToSplitId"::TEXT, items),
              '{}'::JSONB
            ) AS map
          FROM
            (
              SELECT
                aet."exerciseToSplitId",
                JSONB_AGG(
                  aet.exercise_tracking_payload
                  ORDER BY
                    aet."workoutDate" DESC
                ) AS items
              FROM
                all_exercise_trackings aet
              WHERE
                aet."exerciseToSplitId" IS NOT NULL
              GROUP BY
                aet."exerciseToSplitId"
            ) t
        ),
        by_split_name AS (
          SELECT
            COALESCE(JSONB_OBJECT_AGG("splitName", items), '{}'::JSONB) AS map
          FROM
            (
              SELECT
                aet."splitName",
                JSONB_AGG(
                  aet.exercise_tracking_payload
                  ORDER BY
                    aet."workoutDate" DESC
                ) AS items
              FROM
                all_exercise_trackings aet
              WHERE
                aet."splitName" IS NOT NULL
              GROUP BY
                aet."splitName"
            ) t
        )
      SELECT
        JSONB_BUILD_OBJECT(
          'trackingStats',
          JSONB_BUILD_OBJECT(
            'workoutCount',
            COALESCE(
              (SELECT workout_count FROM total_workouts),
              0
            ),
            'workoutTargets',
            JSONB_BUILD_OBJECT(
              'workoutCountThisWeek',
              COALESCE(
                (SELECT count FROM workouts_count_this_week),
                0
              ),
              'workoutCountScheduledPerWeek',
              COALESCE(
                (SELECT count FROM workouts_scheduled_per_week_count),
                0
              ),
              'weekStreak',
              COALESCE(
                (SELECT count FROM weeks_fits_minimum_scheduled_workouts),
                0
              )
            ),
            'lastWorkoutStats',
            JSONB_BUILD_OBJECT(
              'workoutDate',
              (
                TO_CHAR(
                  (
                    SELECT
                      last_date
                    FROM
                      last_workout_date
                  ),
                  'YYYY-MM-DD'
                )
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
                (SELECT exercise_tracked_count FROM last_workout_stats),
                0
              ),
              'setTrackedCount',
              COALESCE(
                (SELECT set_tracked_count FROM last_workout_stats),
                0
              )
            ),
            'prs',
            COALESCE(
              (SELECT all_prs_payload FROM all_prs),
              '[]'::JSONB
            )
          ),
          'trackingMaps',
          JSONB_BUILD_OBJECT(
            'byDate',
            COALESCE(
              (
                SELECT
                  bdm.map
                FROM
                  by_date bdm
              ),
              '{}'::JSONB
            ),
            'byExerciseToSplitId',
            COALESCE(
              (
                SELECT
                  betsid.map
                FROM
                  by_etsid betsid
              ),
              '{}'::JSONB
            ),
            'bySplitName',
            COALESCE(
              (
                SELECT
                  bsn.map
                FROM
                  by_split_name bsn
              ),
              '{}'::JSONB
            )
          )
        ) AS data
    `;

    return data;
  }

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
