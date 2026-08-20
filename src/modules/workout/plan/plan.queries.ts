import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import type { AddWorkoutSplitPayload, WholeUserWorkoutPlan, WorkoutSplitsMap } from '@strong-together/shared';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class WorkoutPlanQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryWholeUserWorkoutPlan(userId: string, tz: string): Promise<WholeUserWorkoutPlan[]> {
    return this.sql<WholeUserWorkoutPlan[]>`
      SELECT
        workoutplans.id::INT,
        workout.get_number_of_splits (workoutplans.id)::INT AS "numberOfSplits",
        workoutplans.created_at AS "createdAt",
        workoutplans.user_id AS "userId",
        workoutplans.is_active AS "isActive",
        (
          workoutplans.updated_at AT TIME ZONE ${tz}
        ) AS "updatedAt",
        (
          SELECT
            COALESCE(
              JSON_AGG(
                JSONB_BUILD_OBJECT(
                  'id', workoutsplits.id,
                  'workoutId', workoutsplits.workout_id,
                  'name', workoutsplits.name,
                  'createdAt', workoutsplits.created_at,
                  'isActive', workoutsplits.is_active,
                  'muscleGroup',
                  workout.get_muscle_group (workoutsplits.id),
                  'exerciseToWorkoutSplit',
                  (
                    SELECT
                      COALESCE(
                        JSON_AGG(
                          JSONB_BUILD_OBJECT(
                            'id',
                            ews.id,
                            'sets',
                            ews.sets,
                            'isActive',
                            ews.is_active,
                            'workoutSplit',
                            ews.workout_split,
                            'exercise',
                            ews.exercise,
                            'targetMuscle',
                            ex.target_muscle,
                            'specificTargetMuscle',
                            ex.specific_target_muscle
                          )
                          ORDER BY
                            ews.order_index
                        ),
                        '[]'::JSON
                      )
                    FROM
                      (
                        SELECT
                          expanded.id,
                          expanded.workout_split_id,
                          expanded.exercise_id,
                          expanded.exercise,
                          expanded.workout_split,
                          expanded.order_index,
                          expanded.is_active,
                          COALESCE(
                            JSONB_AGG(
                              expanded.reps
                              ORDER BY
                                expanded.set_order_index
                            ) FILTER (
                              WHERE
                                expanded.reps IS NOT NULL
                            ),
                            '[]'::JSONB
                          ) AS sets
                        FROM
                          workout.v_exercise_to_workout_split_expanded AS expanded
                        WHERE
                          expanded.is_active = TRUE
                        GROUP BY
                          expanded.id,
                          expanded.workout_split_id,
                          expanded.exercise_id,
                          expanded.exercise,
                          expanded.workout_split,
                          expanded.order_index,
                          expanded.is_active
                      ) AS ews
                      LEFT JOIN workout.exercise ex ON ex.id = ews.exercise_id
                    WHERE
                      ews.workout_split_id = workoutsplits.id
                  )
                )
                ORDER BY
                  workoutsplits.id
              ),
              '[]'::JSON
            )
          FROM
            workout.workout_split AS workoutsplits
          WHERE
            workoutsplits.workout_id = workoutplans.id
            AND workoutsplits.is_active = TRUE
        ) AS "workoutSplits"
      FROM
        workout.workout_plan AS workoutplans
      WHERE
        workoutplans.user_id = ${userId}::UUID
        AND workoutplans.is_active = TRUE
      LIMIT
        1;
    `;
  }

  async queryGetWorkoutSplitsObj(workoutId: number): Promise<{ splits: WorkoutSplitsMap }> {
    // Build the editable workout-plan map, grouped by split name.
    const rows = await this.sql<[{ splits: WorkoutSplitsMap }]>`
      SELECT
        JSONB_OBJECT_AGG(
          ws.name,
          COALESCE(
            (
              SELECT
                JSON_AGG(
                  JSONB_BUILD_OBJECT(
                    'id',
                    ets.exercise_id,
                    'name',
                    ets.exercise,
                    'sets',
                    ets.sets,
                    'orderIndex',
                    ets.order_index,
                    'targetMuscle',
                    e.target_muscle,
                    'specificTargetMuscle',
                    e.specific_target_muscle
                  )
                  ORDER BY
                    ets.order_index
                )
              FROM
                (
                  SELECT
                    expanded.id,
                    expanded.workout_split_id,
                    expanded.exercise_id,
                    expanded.exercise,
                    expanded.order_index,
                    COALESCE(
                      JSONB_AGG(
                        expanded.reps
                        ORDER BY
                          expanded.set_order_index
                      ) FILTER (
                        WHERE
                          expanded.reps IS NOT NULL
                      ),
                      '[]'::JSONB
                    ) AS sets
                  FROM
                    workout.v_exercise_to_workout_split_expanded AS expanded
                  WHERE
                    expanded.is_active = TRUE
                  GROUP BY
                    expanded.id,
                    expanded.workout_split_id,
                    expanded.exercise_id,
                    expanded.exercise,
                    expanded.order_index
                ) AS ets
                INNER JOIN workout.exercise e ON e.id = ets.exercise_id
              WHERE
                ets.workout_split_id = ws.id
            ),
            '[]'::JSON
          )
        ) AS splits
      FROM
        workout.workout_split AS ws
      WHERE
        ws.workout_id = ${workoutId}::int8
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
    const numSplits = Object.keys(payloadJson || {}).length;
    if (!numSplits) throw new Error('workoutData has no splits');

    let planId: number;

    // Create the active workout plan, or touch its update timestamp when it already exists.
    const planResult = await this.sql<[{ id: number }]>`
      INSERT INTO
        workout.workout_plan (user_id, is_active, updated_at)
      VALUES
        (${userId}::UUID, TRUE, NOW())
      ON CONFLICT (user_id)
      WHERE
        is_active DO UPDATE
      SET
        updated_at = NOW()
      RETURNING
        id;
    `;

    if (!planResult?.[0]) {
      throw new Error('Failed to create or retrieve workout plan ID.');
    }
    planId = planResult[0].id;

    // Deactivate the plan's previous splits before reactivating the splits from the new payload.
    await this.sql`
      UPDATE workout.workout_split
      SET
        is_active = FALSE
      WHERE
        workout_id = ${planId};
    `;

    const splitMap: Record<string, number> = {};
    for (const splitName of Object.keys(payloadJson)) {
      // Create this split, or reactivate it when the same split name already exists.
      const [split] = await this.sql<[{ id: number }]>`
        INSERT INTO
          workout.workout_split (workout_id, name, is_active)
        VALUES
          (
            ${planId},
            ${splitName},
            TRUE
          )
        ON CONFLICT (workout_id, name) DO UPDATE
        SET
          is_active = TRUE
        RETURNING
          id;
      `;
      splitMap[splitName] = split.id;
    }

    // Deactivate all previous exercises; payload exercises are reactivated below.
    await this.sql`
      UPDATE workout.exercise_to_workout_split
      SET
        is_active = FALSE
      WHERE
        workout_split_id IN (
          SELECT
            id
          FROM
            workout.workout_split
          WHERE
            workout_id = ${planId}
        );
    `;

    for (const [splitName, exercises] of Object.entries(payloadJson)) {
      for (const [exerciseIndex, exercise] of exercises.entries()) {
        // Create the exercise assignment, or update its order and reactivate it.
        const [savedExercise] = await this.sql<[{ id: number }]>`
          INSERT INTO
            workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
          VALUES
            (
              ${splitMap[splitName]},
              ${exercise.id},
              ${exercise.orderIndex ?? exerciseIndex},
              TRUE
            )
          ON CONFLICT (workout_split_id, exercise_id) DO UPDATE
          SET
            order_index = EXCLUDED.order_index,
            is_active = TRUE
          RETURNING
            id;
        `;

        // Remove the previous planned sets so the payload becomes the complete source of truth.
        await this.sql`
          DELETE FROM workout.workout_set
          WHERE
            exercise_to_split_id = ${savedExercise.id};
        `;

        const sets = Array.isArray(exercise.sets) ? exercise.sets : [exercise.sets];
        for (const [setIndex, reps] of sets.entries()) {
          // Store one planned set with its zero-based order and target reps.
          await this.sql`
            INSERT INTO
              workout.workout_set (exercise_to_split_id, order_index, reps)
            VALUES
              (
                ${savedExercise.id},
                ${setIndex},
                ${reps}
              );
          `;
        }
      }
    }

    return planId;
  }
}
