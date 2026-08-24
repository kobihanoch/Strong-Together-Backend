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
            (NOW() + INTERVAL '1 day') AS upper_bound_utc,
            (
              NOW() - ${days} * INTERVAL '1 day'
            ) AS lower_bound_utc
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
            aws.workout_time_local AS workout_time_local
          FROM
            all_workout_summaries aws
          WHERE
            aws.workout_start_utc >= (
              SELECT
                lower_bound_utc
              FROM
                bounds
              LIMIT
                1
            )
            AND aws.workout_start_utc < (
              SELECT
                upper_bound_utc
              FROM
                bounds
              LIMIT
                1
            )
        ),
        unique_days AS (
          SELECT
            COUNT(aws.id) AS workout_count
          FROM
            all_workout_summaries aws
        ),
        split_performs AS (
          SELECT
            aws.split_name AS name,
            COUNT(aws.id) AS count
          FROM
            all_workout_summaries aws
          GROUP BY
            aws.split_name
        ),
        most_frequent_split AS (
          SELECT
            sp.name,
            sp.count
          FROM
            split_performs sp
          ORDER BY
            sp.count DESC
          LIMIT
            1
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
        all_prs AS (
          SELECT
            p.exercise_to_split_id AS etsid,
            p.exercise_id,
            p.exercise,
            p.weight,
            p.reps,
            (
              (
                p.workout_start_utc AT TIME ZONE ${tz}
              )::date
            ) AS workout_date_utc
          FROM
            analytics.v_prs p
            JOIN all_workout_summaries aws ON p.workout_summary_id = aws.id
        ),
        pr_max AS (
          SELECT
            ap.exercise,
            ap.weight,
            ap.reps,
            ap.workout_date_utc AS workout_time_utc
          FROM
            all_prs ap
          ORDER BY
            weight DESC,
            reps DESC,
            workout_time_utc DESC
          LIMIT
            1
        ),
        all_exercise_trackings AS (
          SELECT
            et.id,
            et.exercise_to_split_id AS "exerciseToSplitId",
            ARRAY_AGG(
              et.weight
              ORDER BY
                et.set_index
            ) AS weight,
            ARRAY_AGG(
              et.reps
              ORDER BY
                et.set_index
            ) AS reps,
            et.exercise_id AS "exerciseId",
            et.workout_split_id AS "workoutSplitId",
            et.split_name AS "splitName",
            et.exercise,
            et.notes,
            ets.order_index AS "orderIndex",
            TO_CHAR(
              (
                et.workout_start_utc at TIME ZONE ${tz}
              )::date,
              'YYYY-MM-DD'
            ) AS "workoutDate",
            JSONB_BUILD_OBJECT(
              'sets',
              JSONB_AGG(
                ets.reps
                ORDER BY
                  ets.set_index
              ),
              'exercises',
              JSONB_BUILD_OBJECT(
                'targetMuscle',
                ex.target_muscle,
                'specificTargetMuscle',
                ex.specific_target_muscle
              )
            ) AS "exerciseToWorkoutSplit"
          FROM
            analytics.v_exercise_tracking_expanded et
            LEFT JOIN workout.v_exercise_to_workout_split_expanded ets ON ets.id = et.exercise_to_split_id
            AND ets.set_index = et.set_index
            JOIN workout.exercise ex ON ex.id = et.exercise_id
          WHERE
            et.workout_summary_id IN (
              SELECT
                id
              FROM
                bounded_workout_summaries
            )
          GROUP BY
            et.id,
            et.exercise_to_split_id,
            et.exercise_id,
            et.workout_split_id,
            et.split_name,
            et.exercise,
            et.notes,
            et.workout_start_utc,
            ets.order_index,
            ex.target_muscle,
            ex.specific_target_muscle
        ),
        by_date AS (
          SELECT
            JSONB_OBJECT_AGG(workout_date_local_string, items) AS map
          FROM
            (
              SELECT
                aet."workoutDate" AS workout_date_local_string,
                JSONB_AGG(
                  TO_JSONB(aet) - 'workoutDate'
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
            JSONB_OBJECT_AGG("exerciseToSplitId", items) AS map
          FROM
            (
              SELECT
                aet."exerciseToSplitId",
                JSONB_AGG(
                  TO_JSONB(aet)
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
            JSONB_OBJECT_AGG("splitName", items) AS map
          FROM
            (
              SELECT
                aet."splitName",
                JSONB_AGG(
                  TO_JSONB(aet) - 'splitName'
                  ORDER BY
                    aet."workoutDate" DESC
                ) AS items
              FROM
                all_exercise_trackings aet
              GROUP BY
                aet."splitName"
            ) t
        )
      SELECT
        JSONB_BUILD_OBJECT(
          'exerciseTrackingAnalysis',
          JSONB_BUILD_OBJECT(
            'uniqueDays',
            (
              SELECT
                workout_count
              FROM
                unique_days
            ),
            'mostFrequentSplit',
            (
              SELECT
                name
              FROM
                most_frequent_split
            ),
            'mostFrequentSplitDays',
            (
              SELECT
                count
              FROM
                most_frequent_split
            ),
            'lastWorkoutDate',
            TO_CHAR(
              (
                SELECT
                  last_date
                FROM
                  last_workout_date
              ),
              'YYYY-MM-DD'
            ),
            'splitDaysByName',
            (
              COALESCE(
                (
                  SELECT
                    JSONB_OBJECT_AGG(sp.name, sp.count)
                  FROM
                    split_performs sp
                ),
                '{}'::JSONB
              )
            ),
            'prs',
            (
              JSONB_BUILD_OBJECT(
                'prMax',
                (
                  COALESCE(
                    (
                      SELECT
                        JSONB_BUILD_OBJECT(
                          'exercise', prm.exercise,
                          'weight', prm.weight,
                          'reps', prm.reps,
                          'workoutTimeUtc', prm.workout_time_utc
                        )
                      FROM
                        pr_max prm
                    ),
                    NULL
                  )
                )
              )
            )
          ),
          'exerciseTrackingMaps',
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
    const [{ workoutSplitId }] = await this.sql<WorkoutSplitLookupQueryDto[]>`
      SELECT
        workout_split_id AS "workoutSplitId"
      FROM
        workout.exercise_to_workout_split
      WHERE
        id = ${workoutArray[0].exerciseToSplitId}
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
      if (exercise.weight.length !== exercise.reps.length) {
        throw new Error('Weight and reps arrays must have the same length');
      }

      // Create one tracking record for this exercise; its sets are inserted next.
      const [{ id: exerciseTrackingId }] = await this.sql<ExerciseTrackingIdQueryDto[]>`
        INSERT INTO
          tracking.exercise_tracking (exercise_to_split_id, notes, workout_summary_id)
        VALUES
          (
            ${exercise.exerciseToSplitId},
            ${exercise.notes ?? ''},
            ${workoutSummaryId}::UUID
          )
        RETURNING
          id;
      `;

      for (let setIndex = 0; setIndex < exercise.reps.length; setIndex += 1) {
        // Store the reps and weight for one performed set at its zero-based index.
        await this.sql`
          INSERT INTO
            tracking.tracking_set (exercise_tracking_id, set_index, reps, weight)
          VALUES
            (
              ${exerciseTrackingId},
              ${setIndex},
              ${exercise.reps[setIndex]},
              ${exercise.weight[setIndex]}
            );
        `;
      }
    }

    return workoutSummaryId;
  }
}
