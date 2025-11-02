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

/**
 * Returns workout analytics + grouped exercise tracking for a specific user in ONE SQL roundtrip.
 *
 * Source tables/views:
 *  - public.workout_summary
 *      Used to get all workouts of the user (all time), including the split name.
 *  - public.v_exercisetracking_expanded
 *      Used to get the actual set-level tracking rows for every workout.
 *  - public.exercisetoworkoutsplit + public.exercises
 *      Used to enrich each tracking row with metadata (sets, target muscle, etc.).
 *
 * What this query does:
 *  1. Loads ALL workout summaries for the user (no date bound), already converted to the user's timezone.
 *  2. Loads ALL exercise-tracking rows that belong to those summaries.
 *  3. Builds analysis data (how many workouts, most used split, last workout date, PR).
 *  4. Builds 3 JSON maps that the frontend can consume directly:
 *     - byDate      → { "YYYY-MM-DD": [rows for that date, ordered by exercise in split] }
 *     - byETSId     → { exercisetosplit_id: [all occurrences of this exercise over time, newest first] }
 *     - bySplitName → { splitname: [all workouts of this split, newest first] }
 *
 * Timezone behavior:
 *  - Every workout datetime is converted with: (.. AT TIME ZONE <tz>)
 *  - Dates in the maps are formatted as strings: 'YYYY-MM-DD'
 *  - Default timezone is "Asia/Jerusalem", but can be overridden via the function param.
 *
 * Returned shape:
 * {
 *   exerciseTrackingAnalysis: {
 *     unique_days: number,                  // actually: number of workout summaries (not DISTINCT dates)
 *     most_frequent_split: string | null,   // split name that appears the most in workout_summary
 *     most_frequent_split_days: number | null, // how many times that split appeared
 *     lastWorkoutDate: string | null,       // latest workout date in user tz, "YYYY-MM-DD"
 *     splitDaysByName: {                    // map of split name -> how many workouts with that split
 *       [splitName: string]: number
 *     },
 *     prs: {
 *       pr_max: {                           // global best PR across all user's workouts
 *         exercise: string,
 *         weight: number,
 *         reps: number,
 *         workout_time_utc: string          // "YYYY-MM-DD" in user tz
 *       } | null
 *     }
 *   },
 *   exerciseTrackingMaps: {
 *     byDate: {
 *       [date: string]: Array<{
 *         id: number,
 *         exercisetosplit_id: number,
 *         weight: number[] | null,
 *         reps: number[] | null,
 *         exercise_id: number,
 *         workoutsplit_id: number | null,
 *         splitname: string | null,
 *         exercise: string | null,
 *         notes: string | null,
 *         exercisetoworkoutsplit: {
 *           sets: number | null,
 *           exercises: {
 *             targetmuscle: string | null,
 *             specifictargetmuscle: string | null
 *           }
 *         }
 *         // note: workoutdate is removed from each item in byDate
 *       }>
 *     },
 *     byETSId: {
 *       [exercisetosplit_id: string]: Array<{
 *         id: number,
 *         exercisetosplit_id: number,       // kept on purpose for frontend "previous workout" logic
 *         weight: number[] | null,
 *         reps: number[] | null,
 *         exercise_id: number,
 *         workoutsplit_id: number | null,
 *         splitname: string | null,
 *         exercise: string | null,
 *         notes: string | null,
 *         workoutdate: string,              // "YYYY-MM-DD", sorted DESC
 *         exercisetoworkoutsplit: {
 *           sets: number | null,
 *           exercises: {
 *             targetmuscle: string | null,
 *             specifictargetmuscle: string | null
 *           }
 *         }
 *       }>
 *     },
 *     bySplitName: {
 *       [splitname: string]: Array<{
 *         id: number,
 *         exercisetosplit_id: number,
 *         weight: number[] | null,
 *         reps: number[] | null,
 *         exercise_id: number,
 *         workoutsplit_id: number | null,
 *         // splitname is removed in this map (to reduce redundancy)
 *         exercise: string | null,
 *         notes: string | null,
 *         workoutdate: string,              // "YYYY-MM-DD", sorted DESC
 *         exercisetoworkoutsplit: {
 *           sets: number | null,
 *           exercises: {
 *             targetmuscle: string | null,
 *             specifictargetmuscle: string | null
 *           }
 *         }
 *       }>
 *     }
 *   }
 * }
 *
 * Important notes:
 *  - The top-level return is { data: { ... } } because the SQL does:
 *      SELECT jsonb_build_object(...) AS data;
 *    so the caller should read: const res = await ...; const data = res.data;
 *  - PRs: right now only "global max PR" is returned (the heaviest lift). Per-exercise PR map is commented out.
 *  - Counting workouts: the query uses COUNT(*) over all workouts for the user,
 *    not COUNT(DISTINCT date). If you want "days trained" instead of "workouts done",
 *    change the CTE `unique_days` to COUNT(DISTINCT aws.workout_time_local::date).
 */

export const queryGetExerciseTrackingAndStats = async (
  userId,
  days = 45,
  tz = "Asia/Jerusalem"
) => {
  const [{ data }] = await sql`
  with 
  -- Get all workout summaries for user
  -- Key: user ID
  all_workout_summaries as(
    select wsum.id, ws.name as split_name, ((wsum.workout_start_utc at time zone ${tz})) as workout_time_local
    from public.workout_summary wsum
    join workoutsplits ws on ws.id = wsum.workoutsplit_id
    where wsum.user_id=${userId}::uuid
  ),

  -- All exercise trackings related to user
  -- Key: workout summary id
  all_exercise_trackings as (
    select et.id, et.exercisetosplit_id, et.weight, et.reps, et.exercise_id, et.workoutsplit_id, et.splitname, et.exercise, et.notes, to_char((et.workout_start_utc at time zone ${tz})::date, 'YYYY-MM-DD') as workoutdate,
    jsonb_build_object(
        'sets', ets.sets,
        'exercises', jsonb_build_object(
          'targetmuscle', ex.targetmuscle,
          'specifictargetmuscle', ex.specifictargetmuscle
        )
      ) as exercisetoworkoutsplit
    from public.v_exercisetracking_expanded et
    join public.exercisetoworkoutsplit ets on ets.id = et.exercisetosplit_id
    join public.exercises ex on ex.id = ets.exercise_id
    where et.workout_summary_id in (select id from all_workout_summaries)
  ),

  -- All workout dates
  unique_days as (
    select count(aws.workout_time_local) as workout_count
    from all_workout_summaries aws
  ),

  -- All splits performs
  split_performs as (
    select aws.split_name as name, count(aws.id) as count
    from all_workout_summaries aws
    group by aws.split_name
  ),

  -- Most frequent split
  -- Contains name and nuber of perfomencres
  most_frequent_split as (
    select sp.name, sp.count
    from split_performs sp
    order by sp.count desc
    limit 1
  ),

  -- Last workout date
  last_workout_date as (
    select aws.workout_time_local::date as last_date
    from all_workout_summaries aws
    order by aws.workout_time_local desc
    limit 1
  ),

  -- PRs
  -- Key: workout summary id
  all_prs as (
    select p.exercisetosplit_id as etsid, p.exercise_id, p.exercise, p.weight, p.reps, ((p.workout_start_utc at time zone ${tz})::date) as workout_date_utc
    from public.v_prs p
    where p.workout_summary_id in (select aws.id from all_workout_summaries aws)
  ),

  -- PR Max
  pr_max as (
    select ap.exercise, ap.weight, ap.reps, ap.workout_date_utc as workout_time_utc
    from all_prs ap
    order by weight desc, reps desc
    limit 1
  ),

  -- Maps

  -- Workout date map
  by_date as (
    select jsonb_object_agg(workout_date_local_string, items) as map
    from (
      select aet.workoutdate as workout_date_local_string, jsonb_agg(to_jsonb(aet) - 'workoutdate' order by ets.order_index asc) as items
      from all_exercise_trackings aet
      join exercisetoworkoutsplit ets on aet.exercisetosplit_id = ets.id
      group by aet.workoutdate
    ) t
  ),

  -- ETSID map
  by_etsid as (
    select jsonb_object_agg(exercisetosplit_id, items) as map
    from (
      select aet.exercisetosplit_id, jsonb_agg(to_jsonb(aet) order by aet.workoutdate desc) as items
      from all_exercise_trackings aet
      group by aet.exercisetosplit_id
    ) t
  ),

  -- Split name map
  by_split_name as (
    select jsonb_object_agg(splitname, items) as map
    from (
      select aet.splitname, jsonb_agg(to_jsonb(aet) - 'splitname' order by aet.workoutdate desc) as items
      from all_exercise_trackings aet
      group by aet.splitname
    ) t
  )

  select jsonb_build_object(
    'exerciseTrackingAnalysis', jsonb_build_object(
      'unique_days', (select workout_count from unique_days),
      'most_frequent_split', (select name from most_frequent_split),
      'most_frequent_split_days', (select count from most_frequent_split),
      'lastWorkoutDate', to_char((select last_date from last_workout_date), 'YYYY-MM-DD'),
      'splitDaysByName', (coalesce((select jsonb_object_agg(sp.name, sp.count) from split_performs sp), '{}'::jsonb)),
      'prs', (jsonb_build_object(
        --'pr_map_etsid', (coalesce((select pme.map from prs_map_etsid pme), '{}'::jsonb)),
        'pr_max', (coalesce((select to_jsonb(prm) from pr_max prm), null))
      ))
    ),
    'exerciseTrackingMaps', jsonb_build_object(
      'byDate', coalesce((select bdm.map from by_date bdm),'{}'::jsonb),
      'byETSId', coalesce((select betsid.map from by_etsid betsid), '{}'::jsonb),
      'bySplitName', coalesce((select bsn.map from by_split_name bsn), '{}'::jsonb)
    )) as data
  `;

  return data;
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
export const queryInsertUserFinishedWorkout = async (
  userId,
  workoutArray,
  workoutStartUtc,
  workoutEndUtc
) => {
  // English comments only inside the code

  // 1) find workoutsplit_id automatically from one of the exercisetosplit_id entries
  const [{ workoutsplit_id }] = await sql`
    select distinct ews.workoutsplit_id
    from jsonb_to_recordset(${workoutArray}::jsonb) as t(exercisetosplit_id int8)
    join public.exercisetoworkoutsplit ews
      on ews.id = t.exercisetosplit_id
    limit 1;
  `;

  // 2) insert workout_summary with derived split_id
  const [{ id: workoutSummaryId }] = await sql`
    insert into public.workout_summary (
      user_id,
      workout_start_utc,
      workout_end_utc,
      workoutsplit_id
    )
    values (
      ${userId}::uuid,
      ${workoutStartUtc}::timestamptz,
      ${workoutEndUtc}::timestamptz,
      ${workoutsplit_id}::int8
    )
    returning id;
  `;

  // 3) insert all tracking rows for that summary
  await sql`
    insert into public.exercisetracking
      (exercisetosplit_id, weight, reps, notes, workout_summary_id)
    select
      t.exercisetosplit_id::int8,
      t.weight::float4[],
      t.reps::int8[],
      coalesce(t.notes, '')::text,
      ${workoutSummaryId}::uuid as workout_summary_id
    from jsonb_to_recordset(${workoutArray}::jsonb) as t(
      exercisetosplit_id int8,
      weight float4[],
      reps int8[],
      notes text
    );
  `;

  return workoutSummaryId;
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
