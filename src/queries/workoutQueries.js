import sql from "../config/db.js";

export async function queryWholeUserWorkoutPlan(userId, tz) {
  return sql`
    SELECT
      workoutplans.*,
      -- Localized timestamp derived from timestamptz using the requested time zone
      (workoutplans.updated_at AT TIME ZONE ${tz}) AS updated_at,
      (
        SELECT json_agg(
                 to_jsonb(workoutsplits.*)
                 || jsonb_build_object(
                      'exercisetoworkoutsplit',
                      (
                        SELECT json_agg(
                                 (to_jsonb(ews.*)
                                  - 'workoutsplit_id'
                                  - 'workout_id'
                                  - 'exercise_id'
                                  - 'created_at'
                                  - 'order_index')
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
 * Data is aggregated from:
 *  - public.v_exercisetracking_expanded (raw exercise sets)
 *  - public.workout_summary (for workout_end_utc / workout_start_utc)
 *
 * Notes on compatibility:
 *  - During migration, COALESCE(workout_summary.workout_end_utc, exercisetracking.workout_time_utc)
 *    is used to support both legacy rows (without summary) and new ones (with summary).
 *  - In the future, filtering and date grouping will rely solely on workout_end_utc.
 *
 * Shape:
 * {
 *   exerciseTrackingAnalysis: {
 *     unique_days: Number,                         // count of DISTINCT workout dates (based on workout_end_utc or fallback)
 *     most_frequent_split: String | null,          // splitname that appears on the most distinct days
 *     most_frequent_split_days: Number | null,     // how many distinct days that split appeared
 *     most_frequent_split_id: Number | null,       // representative workoutsplit_id for that split
 *     hasTrainedToday: Boolean,                    // true if any workout has today's local date
 *     lastWorkoutDate: String | null,              // latest workout date (YYYY-MM-DD)
 *     splitDaysByName: { [splitname: String]: Number }, // map splitname -> distinct workout-day count
 *     prs: {
 *       pr_map_etsid: { [exercise_id]: {...} },    // mapped by exercise id
 *       pr_max: {                                  // global PR (max weight) across all history
 *         exercise: String | null,
 *         weight: Number | null,
 *         reps: Number | null,
 *         workoutdate: String | null               // YYYY-MM-DD
 *       } | null
 *     }
 *   },
 *   exerciseTrackingMaps: {
 *     byDate:      { [date]: Array<row> },         // keys are "YYYY-MM-DD", newest first
 *     byETSId:     { [exercisetosplit_id]: Array<row> },
 *     bySplitName: { [splitname]: Array<row> }
 *   }
 * }
 *
 * Sorting rules:
 * - byDate keys are sorted DESC (newest first). Items inside each date are ordered by order_index ASC,
 *   then by (exercisetosplit_id, exercise_id, id) for deterministic order.
 * - byETSId / bySplitName arrays are sorted by workoutdate DESC, then id DESC.
 * - order_index is taken from v_exercisetoworkoutsplit_expanded; missing values go last.
 * - Null keys are skipped in byETSId / bySplitName.
 *
 * Implementation note:
 * - Timezone-sensitive boundaries use the user's tz (default: Asia/Jerusalem).
 * - The “recent” section filters by workout_end_utc (or fallback) between start_utc and end_utc.
 *
 * @param {uuid} userId - authenticated user's UUID
 * @param {number} days  - how many recent days to include (default 45)
 * @param {string} tz    - IANA timezone string (default "Asia/Jerusalem")
 */

export const queryGetExerciseTrackingAndStats = async (
  userId,
  days = 45,
  tz = "Asia/Jerusalem"
) => {
  return sql`
  with
  -- English comments only inside the code
  params as (
    select
      ${userId}::uuid as user_id,
      ${days}::int    as days,
      coalesce(nullif(${tz}, ''), 'Asia/Jerusalem')::text as tz
  ),

  -- build time window in UTC according to user's tz
  bounds as (
    select
      ((now() at time zone p.tz)::date - p.days)::timestamp at time zone p.tz as start_utc,
      (((now() at time zone p.tz)::date + interval '1 day')::timestamp at time zone p.tz) as end_utc,
      p.user_id,
      p.tz
    from params p
  ),

  /* ============================================================
     ALL-TIME rows (for stats)
     note: we rely on the expanded VIEW that already has:
           workout_time_utc (legacy)
           workout_start_utc, workout_end_utc, workout_summary_id (new)
     ============================================================ */
  all_rows as (
    select
      -- pick real end if exists, otherwise legacy time
      coalesce(et.workout_end_utc, et.workout_time_utc) as workout_dt,
      (coalesce(et.workout_end_utc, et.workout_time_utc) at time zone p.tz)::date as local_day,
      et.exercisetosplit_id,
      et.weight,
      et.reps,
      et.notes,
      et.exercise_id,
      et.splitname,
      et.exercise,
      et.workoutsplit_id
    from public.v_exercisetracking_expanded et
    join params p on true
    where et.user_id = p.user_id
      -- protect against rows that for some reason have no time at all
      and coalesce(et.workout_end_utc, et.workout_time_utc) is not null
  ),

  /* ============================================================
     RECENT rows (only for maps)
     ============================================================ */
  recent_rows_src as (
    select
      coalesce(et.workout_end_utc, et.workout_time_utc) as workout_dt,
      (coalesce(et.workout_end_utc, et.workout_time_utc) at time zone b.tz)::date as local_day,
      et.exercisetosplit_id,
      et.weight,
      et.reps,
      et.notes,
      et.exercise_id,
      et.splitname,
      et.exercise,
      et.workoutsplit_id
    from public.v_exercisetracking_expanded et
    join bounds b on true
    where et.user_id = b.user_id
      and coalesce(et.workout_end_utc, et.workout_time_utc) is not null
      and coalesce(et.workout_end_utc, et.workout_time_utc) >= b.start_utc
      and coalesce(et.workout_end_utc, et.workout_time_utc) <  b.end_utc
  ),

  /* ============================================================
     ALL-TIME stats
     ============================================================ */
  unique_days as (
    select count(distinct local_day) as unique_days
    from all_rows
  ),
  split_counts as (
    select splitname, count(distinct local_day) as days_count
    from all_rows
    where splitname is not null
    group by splitname
  ),
  split_counts_obj as (
    select jsonb_object_agg(splitname, days_count) as split_days_map
    from split_counts
  ),
  top_split as (
    select splitname as most_frequent_split, days_count as most_frequent_split_days
    from split_counts
    order by days_count desc, splitname asc
    limit 1
  ),
  split_counts_by_id as (
    select splitname, workoutsplit_id, count(distinct local_day) as days_count
    from all_rows
    where workoutsplit_id is not null
    group by splitname, workoutsplit_id
  ),
  last_workout as (
    select max(local_day) as last_workout_date
    from all_rows
  ),

  /* PRs: still from v_prs, which already coalesces end/time in ORDER BY */
  prs as (
    select *
    from public.v_prs
    where user_id = ${userId}
  ),

  /* ============================================================
     MAPS (built from RECENT ONLY)
     ============================================================ */
  recent_rows as (
    select
      f.exercise,
      f.exercise_id,
      f.exercisetosplit_id,
      f.splitname,
      f.weight,
      f.reps,
      f.notes,
      to_char(f.local_day, 'YYYY-MM-DD') as workoutdate,
      ews.order_index as order_idx,
      jsonb_build_object(
        'sets', ews.sets,
        'exercises', jsonb_build_object(
          'targetmuscle', ex.targetmuscle,
          'specifictargetmuscle', ex.specifictargetmuscle
        )
      ) as exercisetoworkoutsplit
    from recent_rows_src f
    left join public.v_exercisetoworkoutsplit_expanded ews
      on ews.id = f.exercisetosplit_id
    left join public.exercises ex
      on ex.id = ews.exercise_id
  ),

  by_date_map as (
    select jsonb_object_agg(workoutdate, items order by workoutdate desc) as by_date
    from (
      select
        workoutdate,
        json_agg(
          to_jsonb(r) - 'order_idx'
          order by order_idx asc nulls last, exercisetosplit_id asc, exercise_id asc
        ) as items
      from recent_rows r
      group by workoutdate
    ) x
  ),
  by_ets_map as (
    select jsonb_object_agg(exercisetosplit_id, items) as by_etsid
    from (
      select
        exercisetosplit_id,
        json_agg(
          to_jsonb(r) - 'order_idx'
          order by workoutdate desc
        ) as items
      from recent_rows r
      where exercisetosplit_id is not null
      group by exercisetosplit_id
    ) x
  ),
  by_split_map as (
    select jsonb_object_agg(splitname, items) as by_splitname
    from (
      select
        splitname,
        json_agg(
          to_jsonb(r) - 'order_idx'
          order by workoutdate desc
        ) as items
      from recent_rows r
      where splitname is not null
      group by splitname
    ) x
  )

  select
    json_build_object(
      'unique_days', u.unique_days,
      'most_frequent_split', ts.most_frequent_split,
      'most_frequent_split_days', ts.most_frequent_split_days,
      'lastWorkoutDate', to_char(lw.last_workout_date, 'YYYY-MM-DD'),
      'splitDaysByName', coalesce(sco.split_days_map, '{}'::jsonb)::json,
      'prs', json_build_object(
        -- keep old structure but mapped by exercise_id
        'pr_map_exercise_id',
          coalesce((
            select jsonb_object_agg(ex_id, item)
            from (
              select distinct on (pr.exercise_id)
                pr.exercise_id as ex_id,
                jsonb_build_object(
                  'id', pr.id,
                  'exercise_id', pr.exercise_id,
                  'exercisetosplit_id', pr.exercisetosplit_id,
                  'workout_time_utc',
                    to_char(
                      coalesce(pr.workout_end_utc, pr.workout_time_utc) at time zone (select tz from params),
                      'YYYY-MM-DD'
                    ),
                  'exercise', pr.exercise,
                  'weight', pr.weight,
                  'reps', pr.reps
                ) as item
              from prs pr
              where pr.exercise_id is not null
              order by
                pr.exercise_id,
                pr.weight desc,
                pr.reps desc,
                coalesce(pr.workout_end_utc, pr.workout_time_utc) desc,
                pr.id desc
            ) t
          ), '{}'::jsonb),
        'pr_max',
          coalesce((
            select json_build_object(
              'exercise',    pr.exercise,
              'weight',      pr.weight,
              'reps',        pr.reps,
              'workout_time_utc',
                to_char(
                  coalesce(pr.workout_end_utc, pr.workout_time_utc) at time zone (select tz from params),
                  'YYYY-MM-DD'
                )
            )
            from prs pr
            order by
              pr.weight desc,
              pr.reps desc,
              coalesce(pr.workout_end_utc, pr.workout_time_utc) desc,
              pr.id desc
            limit 1
          ), null)
      )
    ) as "exerciseTrackingAnalysis",
    json_build_object(
      'byDate',      coalesce(bdm.by_date, '{}'::jsonb),
      'byETSId',     coalesce(bem.by_etsid, '{}'::jsonb),
      'bySplitName', coalesce(bsm.by_splitname, '{}'::jsonb)
    ) as "exerciseTrackingMaps"
  from unique_days u
  left join top_split ts         on true
  left join last_workout lw      on true
  left join split_counts_obj sco on true
  left join by_date_map  bdm     on true
  left join by_ets_map   bem     on true
  left join by_split_map bsm     on true;
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
export const queryAddWorkout = async (
  userId,
  workoutData,
  workoutName = "My Workout"
) => {
  // Note: sql() here automatically uses the 'tx' bound by withRlsTx
  const payloadJson = workoutData;
  const numSplits = Object.keys(payloadJson || {}).length;
  if (!numSplits) throw new Error("workoutData has no splits");

  let planId; // --- STEP 1: UPSERT the WORKOUTPLAN (Parent) and retrieve the new ID. ---

  const planResult = await sql`
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
        )
        SELECT id FROM plan;
    `;

  if (!planResult || planResult.length === 0) {
    throw new Error("Failed to create or retrieve workout plan ID.");
  }
  planId = planResult[0].id; // --- STEP 2: UPSERT the WORKOUTSPLITS (Children) and retrieve their IDs. --- // Must be separate so RLS policies on workoutsplits can see the workoutplan row (planId).

  const splitsResult = await sql`
        WITH
        -- Deactivate all splits in this plan (we will re-activate only desired)
        deact_splits AS (
            UPDATE public.workoutsplits s
            SET is_active = FALSE
            WHERE s.workout_id = ${planId}
            RETURNING 1
        )

        -- Upsert desired splits from payload keys; set active = TRUE
        INSERT INTO public.workoutsplits (workout_id, name, is_active)
        SELECT ${planId}, kv.key::text, TRUE
        FROM jsonb_each(${payloadJson}::jsonb) AS kv
        WHERE jsonb_typeof(kv.value) = 'array'
        ON CONFLICT (workout_id, name)
        DO UPDATE SET is_active = TRUE
        RETURNING id, name;
    `; // Create a map for quick lookup: { split_name: split_id }
  const splitMap = splitsResult.reduce((map, split) => {
    map[split.name] = split.id;
    return map;
  }, {}); // --- STEP 3: UPSERT the EXERCISES (Grandchildren). --- // This must be separate so RLS policies on exercisetoworkoutsplit can see the workoutsplits rows.

  await sql`
        WITH
        -- Collect all split IDs that exist in the database and were just upserted
        existing_split_ids AS (
            SELECT id FROM public.workoutsplits WHERE workout_id = ${planId}
        ),

        -- Deactivate all exercises under this plan's existing splits
        deact_exercises AS (
            UPDATE public.exercisetoworkoutsplit ets
            SET is_active = FALSE
            WHERE ets.workoutsplit_id IN (
                SELECT id FROM existing_split_ids
            )
            RETURNING 1
        )

        -- Final action: Upsert desired exercises per split; set active = TRUE
        INSERT INTO public.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
        SELECT
            ((${splitMap}::jsonb) ->> kv.split_name::text)::bigint AS workoutsplit_id, -- Explicitly cast map to jsonb and use ->> operator for lookup
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
        CROSS JOIN LATERAL jsonb_array_elements(arr) WITH ORDINALITY AS e(ex, ord)
        WHERE jsonb_typeof(arr) = 'array'
          AND ((${splitMap}::jsonb) ->> kv.split_name::text) IS NOT NULL -- Use explicit casting for check too
        ON CONFLICT (workoutsplit_id, exercise_id)
        DO UPDATE SET
            sets        = EXCLUDED.sets,
            order_index = EXCLUDED.order_index,
            is_active   = TRUE;
    `;

  return planId;
};
