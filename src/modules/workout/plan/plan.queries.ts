import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { AddWorkoutSplitPayload, WholeUserWorkoutPlan, WorkoutSplitsMap } from '@strong-together/shared';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class WorkoutPlanQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryWholeUserWorkoutPlan(userId: string, tz: string): Promise<WholeUserWorkoutPlan[]> {
    return this.sql<WholeUserWorkoutPlan[]>`
      SELECT
        workoutplans.id::INT, workoutplans.name, workoutplans.numberofsplits::INT, workoutplans.created_at, workoutplans.is_deleted, workoutplans.level, workoutplans.user_id, workoutplans.trainer_id, workoutplans.is_active,
        (workoutplans.updated_at AT TIME ZONE ${tz}) AS updated_at,
        (
          SELECT COALESCE(json_agg(
                    to_jsonb(workoutsplits.*)
                    || jsonb_build_object(
                         'muscle_group', workout.get_muscle_group(workoutsplits.id),
                         'exercisetoworkoutsplit',
                         (
                           SELECT COALESCE(json_agg(
                                    (to_jsonb(ews.*)
                                     - 'workout_split_id'
                                     - 'workout_split'
                                     - 'workout_id'
                                     - 'exercise_id'
                                     - 'created_at'
                                     - 'order_index')
                                    || jsonb_build_object(
                                         'workoutsplit', ews.workout_split,
                                         'targetmuscle', ex.target_muscle,
                                         'specifictargetmuscle', ex.specific_target_muscle
                                       )
                                    ORDER BY ews.order_index
                                  ), '[]'::json)
                           FROM workout.v_exercise_to_workout_split_expanded AS ews
                           LEFT JOIN workout.exercise ex ON ex.id = ews.exercise_id
                           WHERE ews.workout_split_id = workoutsplits.id
                             AND ews.is_active = TRUE
                         )
                       )
                    ORDER BY workoutsplits.id
                  ), '[]'::json)
          FROM workout.workout_split AS workoutsplits
          WHERE workoutsplits.workout_id = workoutplans.id
            AND workoutsplits.is_active = TRUE
        ) AS workoutsplits
      FROM workout.workout_plan AS workoutplans
      WHERE workoutplans.user_id = ${userId}::uuid
        AND workoutplans.is_active = TRUE
      LIMIT 1;
    `;
  }

  async queryGetWorkoutSplitsObj(workoutId: number): Promise<{ splits: WorkoutSplitsMap }> {
    const rows = await this.sql<[{ splits: WorkoutSplitsMap }]>`
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
                       'targetmuscle', e.target_muscle,
                       'specifictargetmuscle', e.specific_target_muscle
                     )
                     ORDER BY ets.order_index
                   )
            FROM workout.v_exercise_to_workout_split_expanded AS ets
            INNER JOIN workout.exercise e ON e.id = ets.exercise_id
            WHERE ets.workout_split_id = ws.id
              AND ets.is_active = TRUE
          ),
          '[]'::json
        )
      ) AS splits
      FROM workout.workout_split AS ws
      WHERE ws.workout_id = ${workoutId}::int8
        AND ws.is_active = TRUE
    `;
    return rows[0];
  }

  async queryAddWorkout(
    userId: string,
    workoutData: AddWorkoutSplitPayload,
    workoutName: string = 'My Workout',
  ): Promise<number> {
    const payloadJson = Object.fromEntries(
      Object.entries(workoutData || {}).filter(([, exercises]) => Array.isArray(exercises) && exercises.length > 0),
    );
    const payloadJsonParam = payloadJson as unknown as postgres.ParameterOrFragment<never>;
    const numSplits = Object.keys(payloadJson || {}).length;
    if (!numSplits) throw new Error('workoutData has no splits');

    let planId: number;

    const planResult = await this.sql<[{ id: number }]>`
        WITH
        plan AS (
            INSERT INTO workout.workout_plan (user_id, trainer_id, name, numberofsplits, is_active, updated_at)
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

    const splitsResult = await this.sql<Array<{ id: number; name: string }>>`
        WITH
        deact_splits AS (
            UPDATE workout.workout_split s
            SET is_active = FALSE
            WHERE s.workout_id = ${planId}
            RETURNING 1
        )

        INSERT INTO workout.workout_split (workout_id, name, is_active)
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

    await this.sql`
        WITH
        existing_split_ids AS (
            SELECT id FROM workout.workout_split WHERE workout_id = ${planId}
        ),

        deact_exercises AS (
            UPDATE workout.exercise_to_workout_split ets
            SET is_active = FALSE
            WHERE ets.workout_split_id IN (
                SELECT id FROM existing_split_ids
            )
            RETURNING 1
        )

        INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, sets, order_index, is_active)
        SELECT
            ((${splitMapParam}::jsonb) ->> kv.split_name::text)::bigint AS workout_split_id,
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
        ON CONFLICT (workout_split_id, exercise_id)
        DO UPDATE SET
            sets        = EXCLUDED.sets,
            order_index = EXCLUDED.order_index,
            is_active   = TRUE;
    `;

    await this.sql`
      UPDATE workout.workout_split AS ws
      SET muscle_group = workout.get_muscle_group(ws.id)
      WHERE ws.workout_id = ${planId}::int8;
    `;

    return planId;
  }
}
