import type postgres from 'postgres';
import sql from '../../../infrastructure/db.client.ts';
import {
  AddWorkoutSplitPayload,
  WholeUserWorkoutPlan,
  WorkoutSplitsMap,
} from '@strong-together/shared';

export async function queryWholeUserWorkoutPlan(userId: string, tz: string): Promise<WholeUserWorkoutPlan[]> {
  return sql<WholeUserWorkoutPlan[]>`
    SELECT
      workoutplans.id::INT, workoutplans.name, workoutplans.numberofsplits::INT, workoutplans.created_at, workoutplans.is_deleted, workoutplans.level, workoutplans.user_id, workoutplans.trainer_id, workoutplans.is_active,
      (workoutplans.updated_at AT TIME ZONE ${tz}) AS updated_at,
      (
        SELECT COALESCE(json_agg(
                  to_jsonb(workoutsplits.*)
                  || jsonb_build_object(
                       'exercisetoworkoutsplit',
                       (
                         SELECT COALESCE(json_agg(
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
                                ), '[]'::json)
                         FROM public.v_exercisetoworkoutsplit_expanded AS ews
                         LEFT JOIN public.exercises ex ON ex.id = ews.exercise_id
                         WHERE ews.workoutsplit_id = workoutsplits.id
                           AND ews.is_active = TRUE
                       )
                     )
                  ORDER BY workoutsplits.id
                ), '[]'::json)
        FROM public.workoutsplits
        WHERE workoutsplits.workout_id = workoutplans.id
          AND workoutsplits.is_active = TRUE
      ) AS workoutsplits
    FROM public.workoutplans
    WHERE workoutplans.user_id = ${userId}::uuid
      AND workoutplans.is_active = TRUE
    LIMIT 1;
  `;
}

export const queryGetWorkoutSplitsObj = async (workoutId: number): Promise<{ splits: WorkoutSplitsMap }> => {
  const rows = await sql<[{ splits: WorkoutSplitsMap }]>`
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
            AND ets.is_active = TRUE
        ),
        '[]'::json
      )
    ) AS splits
    FROM public.workoutsplits AS ws
    WHERE ws.workout_id = ${workoutId}::int8
      AND ws.is_active = TRUE
  `;
  return rows[0];
};

export const queryAddWorkout = async (
  userId: string,
  workoutData: AddWorkoutSplitPayload,
  workoutName: string = 'My Workout',
): Promise<number> => {
  const payloadJson = Object.fromEntries(
    Object.entries(workoutData || {}).filter(([, exercises]) => Array.isArray(exercises) && exercises.length > 0),
  );
  const payloadJsonParam = payloadJson as unknown as postgres.ParameterOrFragment<never>;
  const numSplits = Object.keys(payloadJson || {}).length;
  if (!numSplits) throw new Error('workoutData has no splits');

  let planId: number;

  const planResult = await sql<[{ id: number }]>`
        WITH
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

  if (!planResult?.[0]) {
    throw new Error('Failed to create or retrieve workout plan ID.');
  }
  planId = planResult[0].id;

  const splitsResult = await sql<Array<{ id: number; name: string }>>`
        WITH
        deact_splits AS (
            UPDATE public.workoutsplits s
            SET is_active = FALSE
            WHERE s.workout_id = ${planId}
            RETURNING 1
        )

        INSERT INTO public.workoutsplits (workout_id, name, is_active)
        SELECT ${planId}, kv.key::text, TRUE
        FROM jsonb_each(${payloadJsonParam}::jsonb) AS kv
        WHERE jsonb_typeof(kv.value) = 'array'
          AND jsonb_array_length(kv.value) > 0
        ON CONFLICT (workout_id, name)
        DO UPDATE SET is_active = TRUE
        RETURNING id, name;
    `;
  const splitMap = splitsResult.reduce(
    (map, split) => {
      map[split.name] = split.id;
      return map;
    },
    {} as Record<string, number>,
  );
  const splitMapParam = splitMap as unknown as postgres.ParameterOrFragment<never>;

  await sql`
        WITH
        existing_split_ids AS (
            SELECT id FROM public.workoutsplits WHERE workout_id = ${planId}
        ),

        deact_exercises AS (
            UPDATE public.exercisetoworkoutsplit ets
            SET is_active = FALSE
            WHERE ets.workoutsplit_id IN (
                SELECT id FROM existing_split_ids
            )
            RETURNING 1
        )

        INSERT INTO public.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
        SELECT
            ((${splitMapParam}::jsonb) ->> kv.split_name::text)::bigint AS workoutsplit_id,
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
        FROM jsonb_each(${payloadJsonParam}::jsonb) AS kv(split_name, arr)
        CROSS JOIN LATERAL jsonb_array_elements(arr) WITH ORDINALITY AS e(ex, ord)
        WHERE jsonb_typeof(arr) = 'array'
          AND jsonb_array_length(arr) > 0
          AND ((${splitMapParam}::jsonb) ->> kv.split_name::text) IS NOT NULL
        ON CONFLICT (workoutsplit_id, exercise_id)
        DO UPDATE SET
            sets        = EXCLUDED.sets,
            order_index = EXCLUDED.order_index,
            is_active   = TRUE;
    `;

  return planId;
};
