import sql from "../config/db.js";

export async function queryWholeUserWorkoutPlan(userId) {
  return sql`
    SELECT
      workoutplans.*,
      (
        SELECT json_agg(
                 to_jsonb(workoutsplits.*)
                 || jsonb_build_object(
                   'exercisetoworkoutsplit',
                   (
                     SELECT json_agg(
                              to_jsonb(ews.*)
                              || jsonb_build_object(
                                   'targetmuscle', ex.targetmuscle,
                                   'specifictargetmuscle', ex.specifictargetmuscle
                                 )
                              ORDER BY ews.order_index
                            )
                     FROM exercisetoworkoutsplit ews
                     LEFT JOIN exercises ex ON ex.id = ews.exercise_id
                     WHERE ews.workoutsplit_id = workoutsplits.id
                   )
                 )
                 ORDER BY workoutsplits.id
               )
        FROM workoutsplits
        WHERE workoutsplits.workout_id = workoutplans.id
      ) AS workoutsplits
    FROM workoutplans
    WHERE workoutplans.user_id = ${userId} AND workoutplans.is_active=TRUE
    LIMIT 1;
  `;
}

export const queryGetWorkoutSplitsObj = async (workoutId) => {
  const rows = await sql`SELECT jsonb_object_agg(
    ws.name,
    COALESCE(
      (
        SELECT json_agg(
                 jsonb_build_object('id', ets.exercise_id, 'name', ets.exercise, 'sets', ets.sets, 'order_index', ets.order_index, 'targetmuscle', e.targetmuscle, 'specifictargetmuscle', e.specifictargetmuscle)
                 ORDER BY ets.order_index
               )
        FROM exercisetoworkoutsplit AS ets
        INNER JOIN exercises e ON ets.exercise_id = e.id
        WHERE ets.workoutsplit_id = ws.id
      ),
      '[]'::json
    )
  ) AS splits
  FROM workoutsplits AS ws
  WHERE ws.workout_id = ${workoutId}`;
  return rows[0];
};

/*
 * Returns workout stats + recent tracking for a specific user in ONE roundtrip.
 *
 * Shape:
 * {
 *  exerciseTrackingAnalysis: {
 *        unique_days: Number,                         // count of DISTINCT workout dates across all history
 *        most_frequent_split: String | null,          // splitname that appears on the most distinct days
 *        most_frequent_split_days: Number | null,     // on how many distinct days that split appeared
 *        most_frequent_split_id: Number | null,       // representative workoutsplit_id for that split
 *        hasTrainedToday: Boolean,                    // whether there's any entry with today's date
 *        lastWorkoutDate: String | null,              // most recent workout date across all history (YYYY-MM-DD)
 *        splitDaysByName: { [splitname: String]: Number }, // map splitname -> distinct workout-day count
 *        pr_max: {                                    // global PR (max weight) across all history
 *              exercise: String | null,
 *              weight: Number | null,
 *              reps: Number | null,
 *              workoutdate: String | null                 // YYYY-MM-DD
 *        } | null
 *   },
 *   exerciseTrackingMaps: {
 *          byDate:      { [date]: Array<row> },  // date keys are "YYYY-MM-DD", newest first},
 *          byETSId:     { [exercisetosplit_id]: Array<row> },
 *          bySplitName: { [splitname]: Array<row> }
 *   }
 * }
 *
 * Notes:
 * - byDate keys are sorted DESC (newest first). Items inside each date are sorted by order_index ASC,
 *   then by (exercisetosplit_id, exercise_id, id) to keep a deterministic order.
 * - byETSId/bySplitName arrays are sorted by workoutdate DESC, then id DESC.
 * - order_index is read from exercisetoworkoutsplit; missing values are pushed to the end.
 * - Null keys are skipped in byETSId/bySplitName.
 *
 * }
 * @param {number} userId - authenticated user's id
 * @param {number} days   - how many recent days to include (default 45)
 */

export const queryWorkoutStatsTopSplitPRAndRecent = async (
  userId,
  days = 45
) => {
  return sql`
    /* 1) Filter this user's rows once for reuse */
    WITH filtered AS (
      SELECT *
      FROM exercisetracking
      WHERE user_id = ${userId}
    ),

    /* 2) Stats CTEs */
    unique_days AS (
      SELECT COUNT(DISTINCT workoutdate) AS unique_days
      FROM filtered
    ),
    split_counts AS (
      SELECT splitname, COUNT(DISTINCT workoutdate) AS days_count
      FROM filtered
      WHERE splitname IS NOT NULL
      GROUP BY splitname
    ),
    split_counts_obj AS (
      SELECT jsonb_object_agg(splitname, days_count) AS split_days_map
      FROM split_counts
    ),
    top_split AS (
      SELECT splitname AS most_frequent_split, days_count AS most_frequent_split_days
      FROM split_counts
      ORDER BY days_count DESC, splitname ASC
      LIMIT 1
    ),
    split_counts_by_id AS (
      SELECT splitname, workoutsplit_id, COUNT(DISTINCT workoutdate) AS days_count
      FROM filtered
      WHERE workoutsplit_id IS NOT NULL
      GROUP BY splitname, workoutsplit_id
    ),
    top_split_id AS (
      SELECT scbi.workoutsplit_id AS most_frequent_split_id
      FROM split_counts_by_id scbi
      JOIN top_split ts ON ts.most_frequent_split = scbi.splitname
      ORDER BY scbi.days_count DESC, scbi.workoutsplit_id ASC
      LIMIT 1
    ),
    all_sets AS (
      SELECT f.id, f.exercise, f.workoutdate::date AS workoutdate, s.weight, s.reps
      FROM filtered f
      CROSS JOIN LATERAL unnest(f.weight, f.reps) AS s(weight, reps)
      WHERE s.weight IS NOT NULL
    ),
    max_pr AS (
      SELECT exercise, weight, reps, workoutdate
      FROM all_sets
      ORDER BY weight DESC NULLS LAST, reps DESC NULLS LAST, workoutdate DESC NULLS LAST, id DESC
      LIMIT 1
    ),
    trained_today AS (
      SELECT EXISTS (SELECT 1 FROM filtered WHERE workoutdate = CURRENT_DATE) AS has_trained_today
    ),
    last_workout AS (
      SELECT MAX(workoutdate) AS last_workout_date
      FROM filtered
    ),

    /* 3) Recent rows for building maps (JOIN to get order_index) */
    recent_rows AS (
    SELECT
      et.id,
      et.user_id,
      et.exercise,
      et.exercise_id,
      et.exercisetosplit_id,
      et.splitname,
      et.workoutsplit_id,
      et.weight,
      et.reps,
      to_char(et.workoutdate::date, 'YYYY-MM-DD') AS workoutdate,

      /* Use order_index from exercisetoworkoutsplit; missing values go last */
      COALESCE(ews.order_index, 9223372036854775807) AS order_idx,

      /* Keep only non-duplicated fields inside the nested object */
      CASE
        WHEN ews.id IS NULL THEN '{}'::jsonb
        ELSE jsonb_strip_nulls(
          jsonb_build_object(
            'sets', ews.sets,
            'exercises', jsonb_build_object(
              'targetmuscle', ex.targetmuscle,
              'specifictargetmuscle', ex.specifictargetmuscle
            )
          )
        )
      END AS exercisetoworkoutsplit

    FROM filtered et
    LEFT JOIN exercisetoworkoutsplit ews ON ews.id = et.exercisetosplit_id
    LEFT JOIN exercises ex ON ex.id = ews.exercise_id
    WHERE et.workoutdate >= CURRENT_DATE - make_interval(days => ${days})
  ),

  /* 4) Build the three maps only (no raw array, no splitDatesDesc) */
  /* byDate: drop order_idx from the JSON (used only for sorting) */
  by_date_map AS (
    SELECT jsonb_object_agg(workoutdate, items ORDER BY workoutdate DESC) AS by_date
    FROM (
      SELECT
        workoutdate,
        json_agg(to_jsonb(r) - 'order_idx'
                ORDER BY order_idx ASC, exercisetosplit_id ASC, exercise_id ASC, id ASC) AS items
      FROM recent_rows r
      GROUP BY workoutdate
    ) x
  ),

  /* byETSId: also drop order_idx */
  by_ets_map AS (
    SELECT jsonb_object_agg(exercisetosplit_id, items) AS by_etsid
    FROM (
      SELECT
        exercisetosplit_id,
        json_agg(to_jsonb(r) - 'order_idx'
                ORDER BY workoutdate DESC, id DESC) AS items
      FROM recent_rows r
      WHERE exercisetosplit_id IS NOT NULL
      GROUP BY exercisetosplit_id
    ) x
  ),

  /* bySplitName: also drop order_idx */
  by_split_map AS (
    SELECT jsonb_object_agg(splitname, items) AS by_splitname
    FROM (
      SELECT
        splitname,
        json_agg(to_jsonb(r) - 'order_idx'
                ORDER BY workoutdate DESC, id DESC) AS items
      FROM recent_rows r
      WHERE splitname IS NOT NULL
      GROUP BY splitname
    ) x
  )

    /* 5) Final row: stats + maps, without the raw exerciseTracking */
    SELECT
      json_build_object(
        'unique_days', u.unique_days,
        'most_frequent_split', ts.most_frequent_split,
        'most_frequent_split_days', ts.most_frequent_split_days,
        'most_frequent_split_id', tsi.most_frequent_split_id,
        'hasTrainedToday', tt.has_trained_today,
        'lastWorkoutDate', to_char(lw.last_workout_date, 'YYYY-MM-DD'),
        'splitDaysByName', COALESCE(sco.split_days_map, '{}'::jsonb)::json,
        'pr_max', json_build_object(
          'exercise',    mp.exercise,
          'weight',      mp.weight,
          'reps',        mp.reps,
          'workoutdate', mp.workoutdate
        )
    ) AS "exerciseTrackingAnalysis",

    json_build_object(
      'byDate',      COALESCE(bdm.by_date, '{}'::jsonb),
      'byETSId',     COALESCE(bem.by_etsid, '{}'::jsonb),
      'bySplitName', COALESCE(bsm.by_splitname, '{}'::jsonb)
    ) AS "exerciseTrackingMaps"
    FROM unique_days u
    LEFT JOIN top_split ts          ON TRUE
    LEFT JOIN top_split_id tsi      ON TRUE
    LEFT JOIN trained_today tt      ON TRUE
    LEFT JOIN last_workout lw       ON TRUE
    LEFT JOIN max_pr mp             ON TRUE
    LEFT JOIN split_counts_obj sco  ON TRUE
    LEFT JOIN by_date_map  bdm      ON TRUE
    LEFT JOIN by_ets_map   bem      ON TRUE
    LEFT JOIN by_split_map bsm      ON TRUE;
  `;
};

/*
 * Workout structure
 * [
 * {"exercisetosplit_id": 756, "reps": [1, 3, 3], "user_id": id, "weight": [2.5, 2.5, 5], "workoutdate": "2025-08-13"},
 * {"exercisetosplit_id": 757, "reps": [3, 2, 2], "user_id": id, "weight": [7.5, 7.5, 5], "workoutdate": "2025-08-13"},
 * {"exercisetosplit_id": 758, "reps": [1, 2, 2], "user_id": id, "weight": [5, 5, 5], "workoutdate": "2025-08-13"}
 * ]
 */
export const queryInsertUserFinishedWorkout = async (userId, workoutArray) => {
  if (!Array.isArray(workoutArray) || workoutArray.length === 0) return [];

  // Build tuples with array literals passed as parameters and casted in SQL
  const tuples = workoutArray.map((r) => {
    const reps = Array.isArray(r.reps)
      ? r.reps.map(Number)
      : String(r.reps).split(",").map(Number);

    const weights = Array.isArray(r.weight)
      ? r.weight.map(Number)
      : String(r.weight).split(",").map(Number);

    // Build Postgres array literal strings like "{1,2,3}"
    const repsLit = `{${reps.join(",")}}`;
    const weightsLit = `{${weights.join(",")}}`;

    return sql`
      (
        ${Number(r.exercisetosplit_id)}::int4,
        ${repsLit}::int4[],
        ${weightsLit}::float8[],
        ${userId}::uuid,
        ${r.workoutdate}::date
      )
    `;
  });

  // Join tuples without sql.join
  const values = tuples.reduce(
    (acc, t, i) => (i ? sql`${acc}, ${t}` : t),
    null
  );

  const [etDate] = await sql`
    INSERT INTO exercisetracking
      (exercisetosplit_id, reps, weight, user_id, workoutdate)
    VALUES ${values}
    RETURNING workoutdate
  `;

  const result = await sql`
  SELECT COALESCE(
    jsonb_agg(row_data ORDER BY row_data.workoutdate ASC, row_data.id ASC),
    '[]'::jsonb
  ) AS items
  FROM (
    SELECT
      et.id,
      et.user_id,
      et.exercise,
      et.exercise_id,
      et.exercisetosplit_id,
      et.splitname,
      et.workoutsplit_id,
      et.weight,
      et.reps,
      to_char(et.workoutdate::date, 'YYYY-MM-DD') AS workoutdate,
      (
        SELECT
          to_jsonb(ews.*)
          || jsonb_build_object(
               'exercises',
               json_build_object(
                 'targetmuscle',         ex.targetmuscle,
                 'specifictargetmuscle', ex.specifictargetmuscle
               )
             )
        FROM exercisetoworkoutsplit AS ews
        LEFT JOIN exercises AS ex ON ex.id = ews.exercise_id
        WHERE ews.id = et.exercisetosplit_id
      ) AS exercisetoworkoutsplit
    FROM exercisetracking AS et
    WHERE et.workoutdate = ${etDate.workoutdate}::date AND et.user_id=${userId}
    ORDER BY et.workoutdate::date DESC, et.id DESC
  ) AS row_data
`;

  // result is an array with one row: [{ items: [...] }]
  const items = result[0].items;
  return items;
};

export const queryDeleteUserWorkout = async (userId) => {
  await sql`DELETE FROM workoutplans WHERE user_id=${userId}`;
};

// Adds a workout for user
// Returns same structure as initial fetching to client
// English comments only inside code
export const queryAddWorkout = async (
  userId,
  workoutData, // JS object { A:[...], B:[...] }
  workoutName = "My Workout"
) => {
  const numberOfSplits = Object.keys(workoutData || {}).length;
  if (!numberOfSplits) throw new Error("workoutData has no splits");

  const payloadJson = workoutData;

  await sql`
    WITH
    params AS (
      SELECT ${payloadJson}::jsonb AS data
    ),

    disabled AS (
      UPDATE workoutplans
      SET is_active = FALSE
      WHERE user_id = ${userId} AND is_active = TRUE
      RETURNING 1
    ),

    new_plan AS (
      INSERT INTO workoutplans (user_id, trainer_id, name, numberofsplits, is_active)
      VALUES (${userId}, ${userId}, ${workoutName}, ${numberOfSplits}, TRUE)
      RETURNING id
    ),

    inserted_splits AS (
      INSERT INTO workoutsplits (workout_id, name)
      SELECT
        np.id,
        t.key::text
      FROM params p
      JOIN new_plan np ON TRUE
      CROSS JOIN LATERAL jsonb_each(p.data) AS t(key, val)
      RETURNING id, workout_id, name
    )

    INSERT INTO exercisetoworkoutsplit (exercise_id, workoutsplit_id, sets, order_index)
    SELECT
      (ex->>'id')::int,
      s.id,
      CASE
        WHEN jsonb_typeof(ex->'sets') = 'array' THEN (
          SELECT COALESCE(
            array_agg((elem)::text::bigint ORDER BY elem_ord),
            ARRAY[]::bigint[]
          )
          FROM jsonb_array_elements(ex->'sets') WITH ORDINALITY AS e2(elem, elem_ord)
        )
        WHEN jsonb_typeof(ex->'sets') = 'number' THEN ARRAY[(ex->>'sets')::bigint]::bigint[]
        ELSE ARRAY[]::bigint[]
      END,
      COALESCE((ex->>'order_index')::int, ord - 1)
    FROM params p
    JOIN new_plan np ON TRUE
    CROSS JOIN LATERAL jsonb_each(p.data) AS t(split_name, exercises_json)
    JOIN inserted_splits s
      ON s.workout_id = np.id
     AND s.name = split_name::text
    CROSS JOIN LATERAL jsonb_array_elements(exercises_json) WITH ORDINALITY AS e(ex, ord)
    WHERE jsonb_typeof(p.data) = 'object'
      AND jsonb_typeof(exercises_json) = 'array';
  `;

  return;
};
