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
    /* 1) Compute an estimated 1RM per set (route by rep-range) */
    WITH per_set AS (
      SELECT
        s.user_id,
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
      WHERE s.user_id = ${userId}
        AND s.weight > 0
        AND s.reps BETWEEN 1 AND 12
    ),

    /* 2) Pick the best row per exercise by estimated 1RM */
    best AS (
      SELECT DISTINCT ON (exercise_id)
        ps.user_id,
        ps.exercise_id,
        ps.exercise,
        p.weight  AS pr_weight,
        p.reps    AS pr_reps,
        ps.est_1rm
      FROM per_set ps
      LEFT JOIN public.v_prs p ON ps.exercise_id = p.exercise_id AND ps.user_id = p.user_id
      WHERE ps.est_1rm IS NOT NULL
      ORDER BY ps.exercise_id, ps.est_1rm DESC, p.weight DESC, p.reps DESC, ps.id DESC
    )

    /* 3) Final JSON: { exercise_id: {exercise, pr_weight, pr_reps, max_1rm} } */
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
      -- Planned per split+exercise: sum of the sets[] array from EWS
      SELECT
        ws.id   AS split_id,
        ws.name AS splitname,
        ews.exercise_id,
        ews.exercise,
        SUM( (SELECT SUM(v) FROM unnest(ews.sets) AS v) ) AS planned
      FROM public.workoutsplits ws
      JOIN public.workoutplans w  ON w.id = ws.workout_id
      JOIN public.v_exercisetoworkoutsplit_expanded ews ON ews.workoutsplit_id = ws.id
      WHERE w.user_id = ${userId} AND w.is_active=TRUE
      GROUP BY ws.id, ws.name, ews.exercise_id, ews.exercise
    ),
    a_raw AS (
      -- For each tracked row: sum the reps[] array (one value per row)
      SELECT
        et.workoutsplit_id AS split_id,
        et.splitname       AS splitname,
        et.exercise_id,
        et.exercise,
        (SELECT SUM(x) FROM unnest(et.reps) AS x) AS reps_sum_per_row
      FROM public.v_exercisetracking_expanded et
      WHERE et.user_id = ${userId}
    ),
    a AS (
      -- Actual per split+exercise: average of those per-row sums
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
      -- Join planned with actual on split+exercise
      SELECT
        p.splitname,
        p.exercise,
        p.planned,
        a.actual
      FROM p
      INNER JOIN a
        ON a.splitname   = p.splitname
        AND a.exercise_id = p.exercise_id  
    )
    -- Final JSON: "<splitname>": { "<exercise>": { planned, actual, adherence_pct } }
    SELECT jsonb_object_agg(splitname, per_split) AS result
    FROM (
      SELECT
        splitname,
        jsonb_object_agg(
          exercise,
          jsonb_build_object(
            'planned',        planned,
            'actual',         actual,
            'adherence_pct',  CASE WHEN planned > 0 THEN 100.0 * actual / planned ELSE NULL END
          )
          ORDER BY exercise
        ) AS per_split
      FROM base
      GROUP BY splitname
    ) t;
  `;

  return rows[0]?.result ?? {};
};
