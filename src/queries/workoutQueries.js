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
                              ORDER BY ews.id
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
    WHERE workoutplans.user_id = ${userId}
    LIMIT 1;
  `;
}

export async function queryExerciseTracking(userId) {
  return sql`
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
              'targetmuscle', ex.targetmuscle,
              'specifictargetmuscle', ex.specifictargetmuscle
            )
          )
      FROM exercisetoworkoutsplit AS ews
      LEFT JOIN exercises AS ex
        ON ex.id = ews.exercise_id
      WHERE ews.id = et.exercisetosplit_id
    ) AS exercisetoworkoutsplit
  FROM exercisetracking AS et
  WHERE et.user_id = ${userId}
    AND et.workoutdate >= CURRENT_DATE - INTERVAL '45 days'
  ORDER BY et.workoutdate::date DESC, et.id DESC;
  `;
}

/*
 * Returns workout stats + recent tracking for a specific user in ONE roundtrip.
 *
 * Shape:
 * {
 *   unique_days: number,                           // count of DISTINCT workout dates across all history
 *   most_frequent_split: string | null,            // splitname that appears on the most distinct days
 *   most_frequent_split_days: number | null,       // on how many distinct days that split appeared
 *   most_frequent_split_id: number | null,         // workoutsplit_id representative for the most frequent split (by distinct days)
 *   hasTrainedToday: boolean,                      // whether there's any entry with today's date
 *   lastWorkoutDate: string | null,                // most recent workout date across all history (YYYY-MM-DD)
 *   pr_max: {                                      // global PR (max weight) across all history
 *     exercise: string | null,
 *     weight: number | null,
 *     reps: number | null,
 *     workoutdate: string | null                   // YYYY-MM-DD
 *   } | null,
 *   exerciseTracking: [                            // recent N days (default 45) tracking rows (same shape you already return)
 *     {
 *       id, user_id, exercise, exercise_id, exercisetosplit_id,
 *       splitname, workoutsplit_id, weight, reps,
 *       workoutdate: "YYYY-MM-DD",
 *       exercisetoworkoutsplit: { ...targetmuscle data... }
 *     },
 *     ...
 *   ]
 * }
 * @param {number} userId - authenticated user's id
 * @param {number} days   - how many recent days to include (default 45)
 */

export const queryWorkoutStatsTopSplitPRAndRecent = async (
  userId,
  days = 45
) => {
  return sql`
    /* Filter to this user's rows once so all downstream CTEs reuse it */
    WITH filtered AS (
      SELECT *
      FROM exercisetracking
      WHERE user_id = ${userId}
    ),

    /* Count DISTINCT workout days across all history (each date = one workout day) */
    unique_days AS (
      SELECT COUNT(DISTINCT workoutdate) AS unique_days
      FROM filtered
    ),

    /* For each split, count on how many DISTINCT days it appeared */
    split_counts AS (
      SELECT
        splitname,
        COUNT(DISTINCT workoutdate) AS days_count
      FROM filtered
      WHERE splitname IS NOT NULL
      GROUP BY splitname
    ),

    /* Pick the most frequent split by distinct-day count (tie-break by splitname for determinism) */
    top_split AS (
      SELECT
        splitname AS most_frequent_split,
        days_count AS most_frequent_split_days
      FROM split_counts
      ORDER BY days_count DESC, splitname ASC
      LIMIT 1
    ),

    /* Optional: also resolve a representative workoutsplit_id for that top split (by distinct-day count) */
    split_counts_by_id AS (
      SELECT
        splitname,
        workoutsplit_id,
        COUNT(DISTINCT workoutdate) AS days_count
      FROM filtered
      WHERE workoutsplit_id IS NOT NULL
      GROUP BY splitname, workoutsplit_id
    ),
    top_split_id AS (
      SELECT
        scbi.workoutsplit_id AS most_frequent_split_id
      FROM split_counts_by_id scbi
      JOIN top_split ts ON ts.most_frequent_split = scbi.splitname
      ORDER BY scbi.days_count DESC, scbi.workoutsplit_id ASC
      LIMIT 1
    ),

    /* Unnest (weight[], reps[]) into set rows to find the global PR (max weight).
       We keep reps paired by index and carry exercise + workoutdate for context. */
    all_sets AS (
      SELECT
        f.id,
        f.exercise,
        f.workoutdate::date AS workoutdate,
        s.weight,
        s.reps
      FROM filtered f
      CROSS JOIN LATERAL unnest(f.weight, f.reps) AS s(weight, reps)
      WHERE s.weight IS NOT NULL
    ),

    /* The PR: choose the heaviest set; tie-break by higher reps, then newer date, then higher id */
    max_pr AS (
      SELECT
        exercise,
        weight,
        reps,
        workoutdate
      FROM all_sets
      ORDER BY weight DESC NULLS LAST,
               reps   DESC NULLS LAST,
               workoutdate DESC NULLS LAST,
               id DESC
      LIMIT 1
    ),

    /* Check if there's any workout stamped with today's date */
    trained_today AS (
      SELECT EXISTS (
        SELECT 1
        FROM filtered
        WHERE workoutdate = CURRENT_DATE
      ) AS has_trained_today
    ),

    /* Last workout date across all history */
    last_workout AS (
      SELECT MAX(workoutdate) AS last_workout_date
      FROM filtered
    ),

    /* Recent N days worth of tracking rows in the exact shape your client expects */
    recent AS (
      SELECT json_agg(row ORDER BY workoutdate DESC, id DESC) AS items
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
                    'targetmuscle', ex.targetmuscle,
                    'specifictargetmuscle', ex.specifictargetmuscle
                  )
                )
            FROM exercisetoworkoutsplit AS ews
            LEFT JOIN exercises AS ex
              ON ex.id = ews.exercise_id
            WHERE ews.id = et.exercisetosplit_id
          ) AS exercisetoworkoutsplit
        FROM filtered et
        WHERE et.workoutdate >= CURRENT_DATE - make_interval(days => ${days})
      ) AS row
    )

    /* Final select: combine all pieces into a single row */
    SELECT
      u.unique_days,
      ts.most_frequent_split,
      ts.most_frequent_split_days,
      tsi.most_frequent_split_id,
      tt.has_trained_today AS "hasTrainedToday",
      to_char(lw.last_workout_date, 'YYYY-MM-DD') AS "lastWorkoutDate",
      json_build_object(
        'exercise',    mp.exercise,
        'weight',      mp.weight,
        'reps',        mp.reps,
        'workoutdate', mp.workoutdate
      ) AS pr_max,
      COALESCE(recent.items, '[]'::json) AS exerciseTracking
    FROM unique_days u
    LEFT JOIN top_split ts ON TRUE
    LEFT JOIN top_split_id tsi ON TRUE
    LEFT JOIN trained_today tt ON TRUE
    LEFT JOIN last_workout lw ON TRUE
    LEFT JOIN max_pr mp ON TRUE
    LEFT JOIN recent ON TRUE;
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
  console.log(items);
  return items;
};
