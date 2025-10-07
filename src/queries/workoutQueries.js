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
                                 (to_jsonb(ews.*) - 'workoutsplit_id' - 'workout_id' - 'exercise_id' - 'created_at' - 'order_index')
                                 || jsonb_build_object(
                                      'targetmuscle', ex.targetmuscle,
                                      'specifictargetmuscle', ex.specifictargetmuscle
                                    )
                                 ORDER BY ews.order_index
                               )
                        FROM public.v_exercisetoworkoutsplit_expanded AS ews
                        LEFT JOIN public.exercises ex ON ex.id = ews.exercise_id
                        WHERE ews.workoutsplit_id = workoutsplits.id
                          AND ews.is_active = TRUE              -- filter only active exercise-to-split rows
                      )
                    )
                 ORDER BY workoutsplits.id
               )
        FROM public.workoutsplits
        WHERE workoutsplits.workout_id = workoutplans.id
          AND workoutsplits.is_active = TRUE                     -- filter only active splits
      ) AS workoutsplits
    FROM public.workoutplans
    WHERE workoutplans.user_id = ${userId}::uuid
      AND workoutplans.is_active = TRUE
    LIMIT 1;
  `;
}

// For edit workout
export const queryGetWorkoutSplitsObj = async (workoutId) => {
  const rows = await sql`
    SELECT jsonb_object_agg(
      ws.name,
      COALESCE(
        (
          SELECT json_agg(
                   jsonb_build_object(
                     'id', ets.exercise_id,
                     'name', ets.exercise,
                     'sets', ets.sets,
                     'order_index', ets.order_index,
                     'targetmuscle', e.targetmuscle,
                     'specifictargetmuscle', e.specifictargetmuscle
                   )
                   ORDER BY ets.order_index
                 )
          FROM public.v_exercisetoworkoutsplit_expanded AS ets
          INNER JOIN public.exercises e ON e.id = ets.exercise_id
          WHERE ets.workoutsplit_id = ws.id
            AND ets.is_active = TRUE               -- filter only active exercise-to-split rows
        ),
        '[]'::json
      )
    ) AS splits
    FROM public.workoutsplits AS ws
    WHERE ws.workout_id = ${workoutId}::int8
      AND ws.is_active = TRUE                      -- filter only active splits
  `;
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
 *        prs: {
 *                 pr_map_etsid: {.. Mapped by exercise id}
 *                 pr_max: {                                    // global PR (max weight) across all history
 *                      exercise: String | null,
 *                      weight: Number | null,
 *                      reps: Number | null,
 *                      workoutdate: String | null                 // YYYY-MM-DD
 *                } | null
 *        }
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
 * - order_index is read from v_exercisetoworkoutsplit_expanded; missing values are pushed to the end.
 * - Null keys are skipped in byETSId/bySplitName.
 *
 * }
 * @param {number} userId - authenticated user's id
 * @param {number} days   - how many recent days to include (default 45)
 */
export const queryGetExerciseTrackingAndStats = async (
  userId,
  days = 45,
  tz = "Asia/Jerusalem"
) => {
  return sql`
  WITH
  params AS (
    SELECT
      ${userId}::uuid AS user_id,
      ${days}::int    AS days,
      COALESCE(NULLIF(${tz}, ''), 'Asia/Jerusalem')::text AS tz -- default for backward compatibility
  ),
  bounds AS (
  SELECT
    ((now() AT TIME ZONE p.tz)::date - p.days)::timestamp AT TIME ZONE p.tz AS start_utc,
    now() AS end_utc,
    p.user_id,
    p.tz
  FROM params p
  ),
  filtered AS (
    -- Pull rows for the user within the UTC window; compute local day once
    SELECT
      et.workout_time_utc,
      (et.workout_time_utc AT TIME ZONE b.tz)::date AS local_day,
      et.exercisetosplit_id,
      et.weight,
      et.reps,
      et.notes,
      et.exercise_id,
      et.splitname,
      et.exercise,
      et.workoutsplit_id
    FROM public.v_exercisetracking_expanded et
    JOIN bounds b ON TRUE
    WHERE et.user_id = b.user_id
      AND et.workout_time_utc >= b.start_utc
      AND et.workout_time_utc <  b.end_utc
  ),
  unique_days AS (
    SELECT COUNT(DISTINCT local_day) AS unique_days FROM filtered
  ),
  split_counts AS (
    SELECT splitname, COUNT(DISTINCT local_day) AS days_count
    FROM filtered
    WHERE splitname IS NOT NULL
    GROUP BY splitname
  ),
  split_counts_obj AS (
    SELECT jsonb_object_agg(splitname, days_count) AS split_days_map FROM split_counts
  ),
  top_split AS (
    SELECT splitname AS most_frequent_split, days_count AS most_frequent_split_days
    FROM split_counts
    ORDER BY days_count DESC, splitname ASC
    LIMIT 1
  ),
  split_counts_by_id AS (
    SELECT splitname, workoutsplit_id, COUNT(DISTINCT local_day) AS days_count
    FROM filtered
    WHERE workoutsplit_id IS NOT NULL
    GROUP BY splitname, workoutsplit_id
  ),
  last_workout AS (
    SELECT MAX(local_day) AS last_workout_date FROM filtered
  ),

  -- Precomputed PRs as before (kept intact for output compatibility)
  prs AS (
    SELECT * FROM public.v_prs WHERE user_id = ${userId}
  ),

  -- Recent rows for maps (keyed by local YYYY-MM-DD string)
  recent_rows AS (
    SELECT
      f.exercise,
      f.exercise_id,
      f.exercisetosplit_id,
      f.splitname,
      f.weight,
      f.reps,
      f.notes,
      to_char(f.local_day, 'YYYY-MM-DD') AS workoutdate,
      ews.order_index AS order_idx,
      jsonb_build_object(
        'sets', ews.sets,
        'exercises', jsonb_build_object(
          'targetmuscle', ex.targetmuscle,
          'specifictargetmuscle', ex.specifictargetmuscle
        )
      ) AS exercisetoworkoutsplit
    FROM filtered f
    LEFT JOIN public.v_exercisetoworkoutsplit_expanded ews ON ews.id = f.exercisetosplit_id
    LEFT JOIN public.exercises ex ON ex.id = ews.exercise_id
  ),

  by_date_map AS (
    SELECT jsonb_object_agg(workoutdate, items ORDER BY workoutdate DESC) AS by_date
    FROM (
      SELECT
        workoutdate,
        json_agg(to_jsonb(r) - 'order_idx'
                ORDER BY order_idx ASC, exercisetosplit_id ASC, exercise_id ASC) AS items
      FROM recent_rows r
      GROUP BY workoutdate
    ) x
  ),
  by_ets_map AS (
    SELECT jsonb_object_agg(exercisetosplit_id, items) AS by_etsid
    FROM (
      SELECT
        exercisetosplit_id,
        json_agg(to_jsonb(r) - 'order_idx'
                ORDER BY workoutdate DESC) AS items
      FROM recent_rows r
      WHERE exercisetosplit_id IS NOT NULL
      GROUP BY exercisetosplit_id
    ) x
  ),
  by_split_map AS (
    SELECT jsonb_object_agg(splitname, items) AS by_splitname
    FROM (
      SELECT
        splitname,
        json_agg(to_jsonb(r) - 'order_idx'
                ORDER BY workoutdate DESC) AS items
      FROM recent_rows r
      WHERE splitname IS NOT NULL
      GROUP BY splitname
    ) x
  )

  SELECT
    json_build_object(
      'unique_days', u.unique_days,
      'most_frequent_split', ts.most_frequent_split,
      'most_frequent_split_days', ts.most_frequent_split_days,
      'lastWorkoutDate', to_char(lw.last_workout_date, 'YYYY-MM-DD'),
      'splitDaysByName', COALESCE(sco.split_days_map, '{}'::jsonb)::json,
      'prs', json_build_object(
        'pr_map_exercise_id',
          COALESCE((
            SELECT jsonb_object_agg(ex_id, item)
            FROM (
              SELECT DISTINCT ON (pr.exercise_id)
                pr.exercise_id AS ex_id,
                jsonb_build_object(
                  'id', pr.id,
                  'exercise_id', pr.exercise_id,
                  'exercisetosplit_id', pr.exercisetosplit_id,
                  'workoutdate', to_char(pr.workoutdate::date, 'YYYY-MM-DD'),
                  'exercise', pr.exercise,
                  'weight', pr.weight,
                  'reps', pr.reps
                ) AS item
              FROM prs pr
              WHERE pr.exercise_id IS NOT NULL
                AND pr.user_id = ${userId}
              ORDER BY
                pr.exercise_id,
                pr.weight      DESC,
                pr.reps        DESC,
                pr.workoutdate DESC,
                pr.id          DESC
            ) t
          ), '{}'::jsonb),
        'pr_max',
          COALESCE((
            SELECT json_build_object(
              'exercise',    pr.exercise,
              'weight',      pr.weight,
              'reps',        pr.reps,
              'workoutdate', to_char(pr.workoutdate::date, 'YYYY-MM-DD')
            )
            FROM prs pr
            WHERE pr.user_id = ${userId}
            ORDER BY pr.weight DESC, pr.reps DESC, pr.workoutdate DESC, pr.id DESC
            LIMIT 1
          ), NULL)
      )
    ) AS "exerciseTrackingAnalysis",
    json_build_object(
      'byDate',      COALESCE(bdm.by_date, '{}'::jsonb),
      'byETSId',     COALESCE(bem.by_etsid, '{}'::jsonb),
      'bySplitName', COALESCE(bsm.by_splitname, '{}'::jsonb)
    ) AS "exerciseTrackingMaps"
  FROM unique_days u
  LEFT JOIN top_split ts         ON TRUE
  LEFT JOIN last_workout lw      ON TRUE
  LEFT JOIN split_counts_obj sco ON TRUE
  LEFT JOIN by_date_map  bdm     ON TRUE
  LEFT JOIN by_ets_map   bem     ON TRUE
  LEFT JOIN by_split_map bsm     ON TRUE;
  `;
};

/**
 * rows: Array of row objects
 * [
 *   {
 *     exercisetosplit_id: 764,
 *     weight: [80, 70, 70],         // float4[]
 *     reps: [6, 7, 7],              // int8[]
 *     user_id: null => need to get from middleware to avoid injections,
 *     notes: null
 *   },
 *   ...
 * ]
 */
export const queryInsertUserFinishedWorkout = async (userId, workoutArray) => {
  await sql`
    INSERT INTO exercisetracking
      (exercisetosplit_id, weight, reps, user_id, notes)
    SELECT
      t.exercisetosplit_id::int8,
      t.weight::float4[],
      t.reps::int8[],
      ${userId}::uuid AS user_id,
      t.notes::text
    FROM jsonb_to_recordset(${workoutArray}::jsonb) AS t(
      exercisetosplit_id int8,
      weight float4[],
      reps int8[],
      user_id uuid,
      notes text
    )
    RETURNING id;
  `;
};

export const queryDeleteUserWorkout = async (userId) => {
  await sql`DELETE FROM public.workoutplans WHERE user_id = ${userId}::uuid`;
};

// Adds a workout for user
// Returns same structure as initial fetching to client
// English comments only inside code
export const queryAddWorkout = async (
  userId,
  workoutData,
  workoutName = "My Workout"
) => {
  const payloadJson = workoutData;
  const numSplits = Object.keys(payloadJson || {}).length;
  if (!numSplits) throw new Error("workoutData has no splits");

  await sql.begin(async (trx) => {
    await trx`
      WITH
      -- Ensure (or update) one active plan for this user
      plan AS (
        INSERT INTO public.workoutplans (user_id, trainer_id, name, numberofsplits, is_active, updated_at)
        VALUES (${userId}::uuid, ${userId}::uuid, ${workoutName}::text, ${numSplits}::int, TRUE, NOW())
        ON CONFLICT (user_id) WHERE (is_active)
        DO UPDATE SET
          name           = EXCLUDED.name,
          trainer_id     = EXCLUDED.trainer_id,
          numberofsplits = EXCLUDED.numberofsplits,
          is_active      = TRUE,
          updated_at     = NOW()
        RETURNING id
      ),

      -- Deactivate all splits in this plan (we will re-activate only desired)
      deact_splits AS (
        UPDATE public.workoutsplits s
        SET is_active = FALSE
        WHERE s.workout_id = (SELECT id FROM plan)
        RETURNING 1
      ),

      -- Upsert desired splits from payload keys; set active = TRUE
      upsert_splits AS (
        INSERT INTO public.workoutsplits (workout_id, name, is_active)
        SELECT (SELECT id FROM plan), kv.key::text, TRUE
        FROM jsonb_each(${payloadJson}::jsonb) AS kv
        WHERE jsonb_typeof(kv.value) = 'array'
        ON CONFLICT (workout_id, name)
        DO UPDATE SET is_active = TRUE
        RETURNING id, name
      ),

      -- Deactivate all exercises under this plan (scope via workoutsplits -> no workout_id column on ETS)
      deact_exercises AS (
        UPDATE public.exercisetoworkoutsplit ets
        SET is_active = FALSE
        WHERE ets.workoutsplit_id IN (
          SELECT s.id FROM public.workoutsplits s
          WHERE s.workout_id = (SELECT id FROM plan)
        )
        RETURNING 1
      )

      -- Upsert desired exercises per split; set active = TRUE
      INSERT INTO public.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
      SELECT
        s.id AS workoutsplit_id,
        (ex->>'id')::bigint AS exercise_id,
        CASE
          WHEN jsonb_typeof(ex->'sets') = 'array' THEN (
            SELECT COALESCE(array_agg((elem)::text::bigint ORDER BY ord2), ARRAY[]::bigint[])
            FROM jsonb_array_elements(ex->'sets') WITH ORDINALITY AS e2(elem, ord2)
          )
          WHEN jsonb_typeof(ex->'sets') = 'number' THEN ARRAY[(ex->>'sets')::bigint]::bigint[]
          ELSE ARRAY[]::bigint[]
        END AS sets,
        COALESCE((ex->>'order_index')::bigint, (ord - 1)) AS order_index,
        TRUE AS is_active
      FROM jsonb_each(${payloadJson}::jsonb) AS kv(split_name, arr)
      JOIN upsert_splits s
        ON s.name = kv.split_name::text
      CROSS JOIN LATERAL jsonb_array_elements(arr) WITH ORDINALITY AS e(ex, ord)
      WHERE jsonb_typeof(arr) = 'array'
      ON CONFLICT (workoutsplit_id, exercise_id)
      DO UPDATE SET
        sets        = EXCLUDED.sets,
        order_index = EXCLUDED.order_index,
        is_active   = TRUE
    `;
  });

  return;
};
