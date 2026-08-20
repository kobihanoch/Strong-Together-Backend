import { Inject, Injectable } from '@nestjs/common';
import type { GoalAdherenceResponse, WorkoutRMsResponse } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

/**
 * {
 *        [ex_id]: {
 *                exercise (name),
 *                pr_weight,
 *                pr_reps
 *                max_1rm
 *        } , .....
 * }
 */
@Injectable()
export class AnalyticsQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryGetWorkoutRMs(userId: string): Promise<WorkoutRMsResponse> {
    const [{ result }] = await this.sql<{ result: WorkoutRMsResponse }[]>`
      WITH
        -- All workouts for this user (authoritative source)
        all_workout_summaries AS (
          SELECT
            id
          FROM
            tracking.workout_summary
          WHERE
            user_id = ${userId}::UUID
        ),
        -- All performed sets (only from this user's workouts)
        per_set AS (
          SELECT
            et.exercise_id,
            et.exercise,
            et.id,
            et.weight,
            et.reps,
            CASE
              WHEN et.reps = 1 THEN et.weight::NUMERIC
              WHEN et.reps BETWEEN 2 AND 5  THEN (et.weight * (1 + 0.0333 * et.reps))::NUMERIC -- Epley
              WHEN et.reps BETWEEN 6 AND 10  THEN (et.weight * 36.0 / (37.0 - et.reps))::NUMERIC -- Brzycki
              WHEN et.reps BETWEEN 11 AND 12  THEN (et.weight * (1 + 0.025 * et.reps))::NUMERIC -- O'Connor
              ELSE NULL
            END AS est_1rm
          FROM
            analytics.v_exercise_tracking_expanded et
          WHERE
            et.workout_summary_id IN (
              SELECT
                id
              FROM
                all_workout_summaries
            )
            AND et.weight > 0
            AND et.reps BETWEEN 1 AND 12
        ),
        -- All PR rows for this user's workouts (not by user_id, but by summary chain)
        all_prs AS (
          SELECT
            p.exercise_id,
            p.exercise,
            p.weight,
            p.reps,
            p.workout_summary_id
          FROM
            analytics.v_prs p
          WHERE
            p.workout_summary_id IN (
              SELECT
                id
              FROM
                all_workout_summaries
            )
        ),
        -- One PR row per exercise (heaviest, then most reps, then latest)
        pr_per_exercise AS (
          SELECT DISTINCT
            ON (ap.exercise_id) ap.exercise_id,
            ap.exercise,
            ap.weight,
            ap.reps
          FROM
            all_prs ap
          ORDER BY
            ap.exercise_id,
            ap.weight DESC,
            ap.reps DESC,
            ap.workout_summary_id DESC
        ),
        -- Choose best 1RM per exercise, and attach PR if exists
        best AS (
          SELECT DISTINCT
            ON (ps.exercise_id) ps.exercise_id,
            ps.exercise,
            ppe.weight AS pr_weight,
            ppe.reps AS pr_reps,
            ps.est_1rm
          FROM
            per_set ps
            LEFT JOIN pr_per_exercise ppe ON ppe.exercise_id = ps.exercise_id
          WHERE
            ps.est_1rm IS NOT NULL
          ORDER BY
            ps.exercise_id,
            ps.est_1rm DESC,
            ppe.weight DESC NULLS LAST,
            ppe.reps DESC NULLS LAST,
            ps.id DESC
        )
      SELECT
        COALESCE(
          JSONB_OBJECT_AGG(
            exercise_id,
            JSONB_BUILD_OBJECT(
              'exercise',
              exercise,
              'prWeight',
              pr_weight,
              'prReps',
              pr_reps,
              'max1Rm',
              ROUND(est_1rm, 1)
            )
          ),
          '{}'::JSONB
        ) AS result
      FROM
        best;
    `;

    return result ?? {};
  }

  /**
   * {
   *      [splitname]: { [exercise]: { planned, actual } }
   * }
   */

  async queryGoalAdherence(userId: string): Promise<GoalAdherenceResponse> {
    const [{ result }] = await this.sql<{ result: GoalAdherenceResponse }[]>`
      WITH
        -- Planned volume per split+exercise from the user's active plans
        planned AS (
          SELECT
            ws.id AS split_id,
            ws.name AS splitname,
            ews.exercise_id,
            ews.exercise,
            SUM(ews.reps) AS planned -- Planned total sets per ex
          FROM
            workout.workout_plan w
            JOIN workout.workout_split ws ON ws.workout_id = w.id
            JOIN workout.v_exercise_to_workout_split_expanded ews ON ews.workout_split_id = ws.id
          WHERE
            w.user_id = ${userId}::UUID
            AND w.is_active = TRUE
          GROUP BY
            ws.id,
            ws.name,
            ews.exercise_id,
            ews.exercise
        ),
        -- All workouts actually performed by this user
        all_workout_summaries AS (
          SELECT
            ws.id,
            ws.workout_split_id
          FROM
            tracking.workout_summary ws
          WHERE
            ws.user_id = ${userId}::UUID
            AND ws.workout_split_id IS NOT NULL
        ),
        -- Raw performed reps per workout+exercise
        actual_raw AS (
          SELECT
            aws.id,
            aws.workout_split_id AS split_id,
            wspl.name AS splitname,
            et.exercise_id,
            et.exercise,
            SUM(et.reps) AS reps_sum_per_row
          FROM
            analytics.v_exercise_tracking_expanded et
            JOIN all_workout_summaries aws ON aws.id = et.workout_summary_id
            LEFT JOIN workout.workout_split wspl ON wspl.id = aws.workout_split_id
          GROUP BY
            aws.id,
            aws.workout_split_id,
            wspl.name,
            et.exercise_id,
            et.exercise
        ),
        -- Aggregate actual per split+exercise
        actual AS (
          SELECT
            split_id,
            splitname,
            exercise_id,
            exercise,
            AVG(reps_sum_per_row) AS actual
          FROM
            actual_raw
          GROUP BY
            split_id,
            splitname,
            exercise_id,
            exercise
        ),
        -- Join planned with actual
        joined AS (
          SELECT
            p.splitname,
            p.exercise,
            p.planned,
            a.actual
          FROM
            planned p
            JOIN actual a ON a.split_id = p.split_id
            AND a.exercise_id = p.exercise_id
        )
      SELECT
        COALESCE(JSONB_OBJECT_AGG(splitname, per_split), '{}'::JSONB) AS result
      FROM
        (
          SELECT
            splitname,
            JSONB_OBJECT_AGG(
              exercise,
              JSONB_BUILD_OBJECT(
                'planned',
                planned,
                'actual',
                actual,
                'adherencePct',
                CASE
                  WHEN planned > 0 THEN 100.0 * actual / planned
                  ELSE NULL
                END
              )
              ORDER BY
                exercise
            ) AS per_split
          FROM
            joined
          GROUP BY
            splitname
        ) t;
    `;

    return result ?? {};
  }
}
