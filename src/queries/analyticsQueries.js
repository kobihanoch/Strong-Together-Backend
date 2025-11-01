import sql from "../config/db.js";

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
export const queryGetWorkoutRMs = async (userId) => {
  const rows = await sql`
    /* 1) per-set 1RM, but user identification is via workout_summary */
    WITH per_set AS (
      SELECT
        ws.user_id,                -- comes from workout_summary
        s.exercise_id,
        s.exercise,
        s.id,
        s.weight,
        s.reps,
        CASE
          WHEN s.reps = 1 THEN s.weight::numeric
          WHEN s.reps BETWEEN 2 AND 5  THEN (s.weight * (1 + 0.0333 * s.reps))::numeric   -- Epley
          WHEN s.reps BETWEEN 6 AND 10 THEN (s.weight * 36.0 / (37.0 - s.reps))::numeric  -- Brzycki
          WHEN s.reps BETWEEN 11 AND 12 THEN (s.weight * (1 + 0.025 * s.reps))::numeric   -- O'Connor
          ELSE NULL
        END AS est_1rm
      FROM public.v_exercisetracking_set_simple AS s
      JOIN public.workout_summary ws
        ON ws.id = s.workout_summary_id
      WHERE ws.user_id = ${userId}
        AND s.weight > 0
        AND s.reps BETWEEN 1 AND 12
    ),

    /* 2) choose best per exercise (highest estimated 1RM) */
    best AS (
      SELECT DISTINCT ON (ps.exercise_id)
        ps.exercise_id,
        ps.exercise,
        p.weight  AS pr_weight,
        p.reps    AS pr_reps,
        ps.est_1rm
      FROM per_set ps
      LEFT JOIN public.v_prs p
        ON p.exercise_id = ps.exercise_id
       AND p.user_id     = ${userId}  -- tie to same user
      WHERE ps.est_1rm IS NOT NULL
      ORDER BY
        ps.exercise_id,
        ps.est_1rm DESC,
        p.weight DESC,
        p.reps DESC,
        ps.id DESC
    )

    /* 3) final json */
    SELECT COALESCE(
      jsonb_object_agg(
        exercise_id,
        jsonb_build_object(
          'exercise',  exercise,
          'pr_weight', pr_weight,
          'pr_reps',   pr_reps,
          'max_1rm',   ROUND(est_1rm, 1)
        )
      ),
      '{}'::jsonb
    ) AS result
    FROM best;
  `;

  return rows[0]?.result ?? {};
};

/**
 * {
 *      [splitname]: { [exercise]: { planned, actual } }
 * }
 */

export const queryGoalAdherence = async (userId) => {
  const rows = await sql`
    WITH p AS (
      -- planned per split+exercise (from user's active plans)
      SELECT
        ws.id   AS split_id,
        ws.name AS splitname,
        ews.exercise_id,
        ews.exercise,
        SUM( (SELECT SUM(v) FROM unnest(ews.sets) AS v) ) AS planned
      FROM public.workoutsplits ws
      JOIN public.workoutplans w
        ON w.id = ws.workout_id
      JOIN public.v_exercisetoworkoutsplit_expanded ews
        ON ews.workoutsplit_id = ws.id
      WHERE w.user_id = ${userId}
        AND w.is_active = TRUE
      GROUP BY ws.id, ws.name, ews.exercise_id, ews.exercise
    ),

    a_raw AS (
      -- actual reps per performed workout, user and split are taken ONLY from workout_summary
      SELECT
        ws.workoutsplit_id        AS split_id,
        wspl.name                 AS splitname,
        et.exercise_id,
        et.exercise,
        (SELECT SUM(x) FROM unnest(et.reps) AS x) AS reps_sum_per_row
      FROM public.v_exercisetracking_expanded et
      JOIN public.workout_summary ws
        ON ws.id = et.workout_summary_id
      LEFT JOIN public.workoutsplits wspl
        ON wspl.id = ws.workoutsplit_id
      WHERE ws.user_id = ${userId}
        AND ws.workoutsplit_id IS NOT NULL   -- no fallback
    ),

    a AS (
      -- aggregate actual per split+exercise
      SELECT
        split_id,
        splitname,
        exercise_id,
        exercise,
        AVG(reps_sum_per_row) AS actual
      FROM a_raw
      GROUP BY split_id, splitname, exercise_id, exercise
    ),

    base AS (
      -- join planned with actual
      SELECT
        p.splitname,
        p.exercise,
        p.planned,
        a.actual
      FROM p
      INNER JOIN a
        ON a.split_id    = p.split_id
       AND a.exercise_id = p.exercise_id
    )

    SELECT jsonb_object_agg(splitname, per_split) AS result
    FROM (
      SELECT
        splitname,
        jsonb_object_agg(
          exercise,
          jsonb_build_object(
            'planned',       planned,
            'actual',        actual,
            'adherence_pct', CASE WHEN planned > 0 THEN 100.0 * actual / planned ELSE NULL END
          )
          ORDER BY exercise
        ) AS per_split
      FROM base
      GROUP BY splitname
    ) t;
  `;

  return rows[0]?.result ?? {};
};
