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
        workoutplans.id::INT, workoutplans.name, workout.get_number_of_splits(workoutplans.id)::INT AS numberofsplits, workoutplans.created_at, workoutplans.is_deleted, workoutplans.level, workoutplans.user_id, workoutplans.trainer_id, workoutplans.is_active,
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
            INSERT INTO workout.workout_plan (user_id, trainer_id, name, is_active, updated_at)
            VALUES (${userId}::uuid, ${userId}::uuid, ${workoutName}::text, TRUE, NOW())
            ON CONFLICT (user_id) WHERE (is_active)
            DO UPDATE SET
                name           = EXCLUDED.name,
                trainer_id     = EXCLUDED.trainer_id,
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
        ),
        upserted_exercises AS (
          INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
        SELECT
            ((${splitMapParam}::jsonb) ->> kv.split_name::text)::bigint AS workout_split_id,
            (ex->>'id')::bigint AS exercise_id,
            COALESCE((ex->>'order_index')::bigint, (ord - 1)) AS order_index,
            TRUE AS is_active
        FROM jsonb_each(${payloadJsonParam}::jsonb) AS kv(split_name, arr)
        CROSS JOIN LATERAL jsonb_array_elements(arr) WITH ORDINALITY AS e(ex, ord)
        WHERE jsonb_typeof(arr) = 'array'
          AND jsonb_array_length(arr) > 0
          AND ((${splitMapParam}::jsonb) ->> kv.split_name::text) IS NOT NULL
        ON CONFLICT (workout_split_id, exercise_id)
        DO UPDATE SET
            order_index = EXCLUDED.order_index,
            is_active   = TRUE
          RETURNING id
        )
        INSERT INTO workout.workout_set (exercise_to_split_id, order_index, reps)
        SELECT
            upserted_exercises.id,
            set_data.set_index::integer,
            set_data.reps::integer
        FROM jsonb_each(${payloadJsonParam}::jsonb) AS kv(split_name, arr)
        CROSS JOIN LATERAL jsonb_array_elements(arr) AS exercise_data(exercise)
        JOIN upserted_exercises
          ON upserted_exercises.id = (
            SELECT ets.id
            FROM workout.exercise_to_workout_split ets
            WHERE ets.workout_split_id = ((${splitMapParam}::jsonb) ->> kv.split_name::text)::bigint
              AND ets.exercise_id = (exercise_data.exercise->>'id')::bigint
          )
        CROSS JOIN LATERAL (
          SELECT (set_ordinality - 1)::integer AS set_index, set_value::text::integer AS reps
          FROM jsonb_array_elements(
            CASE
              WHEN jsonb_typeof(exercise_data.exercise->'sets') = 'array' THEN exercise_data.exercise->'sets'
              WHEN jsonb_typeof(exercise_data.exercise->'sets') = 'number' THEN jsonb_build_array(exercise_data.exercise->'sets')
              ELSE '[]'::jsonb
            END
          ) WITH ORDINALITY AS planned_set(set_value, set_ordinality)
        ) AS set_data
        ON CONFLICT (exercise_to_split_id, order_index)
        DO UPDATE SET reps = EXCLUDED.reps;
    `;

    await this.sql`
      DELETE FROM workout.workout_set workout_set
      USING workout.exercise_to_workout_split ets
      WHERE workout_set.exercise_to_split_id = ets.id
        AND ets.workout_split_id IN (
          SELECT value::bigint FROM jsonb_each_text(${splitMapParam}::jsonb)
        )
        AND NOT EXISTS (
          SELECT 1
          FROM jsonb_each(${payloadJsonParam}::jsonb) AS kv(split_name, arr)
          CROSS JOIN LATERAL jsonb_array_elements(arr) AS exercise_data(exercise)
          CROSS JOIN LATERAL jsonb_array_elements(
            CASE
              WHEN jsonb_typeof(exercise_data.exercise->'sets') = 'array' THEN exercise_data.exercise->'sets'
              WHEN jsonb_typeof(exercise_data.exercise->'sets') = 'number' THEN jsonb_build_array(exercise_data.exercise->'sets')
              ELSE '[]'::jsonb
            END
          ) WITH ORDINALITY AS planned_set(set_value, set_ordinality)
          WHERE ((${splitMapParam}::jsonb) ->> kv.split_name::text)::bigint = ets.workout_split_id
            AND (exercise_data.exercise->>'id')::bigint = ets.exercise_id
            AND (planned_set.set_ordinality - 1)::integer = workout_set.order_index
        );
    `;

    await this.sql`
      UPDATE workout.workout_split AS ws
      SET muscle_group = workout.get_muscle_group(ws.id)
      WHERE ws.workout_id = ${planId}::int8;
    `;

    return planId;
  }
}
