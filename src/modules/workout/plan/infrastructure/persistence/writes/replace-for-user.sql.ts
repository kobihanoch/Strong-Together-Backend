import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { WorkoutExerciseInput, WorkoutSplitInput } from '../../../application/models/workout-plan.models';
import type { ExerciseAssignmentIdSqlRow, ExistingExercisesSqlRow, WorkoutPlanIdSqlRow, WorkoutSplitIdSqlRow } from '../workout-plan.db-types';

/** Represents the existing workout split input value. */
type ExistingWorkoutSplitInput = WorkoutSplitInput & { id: number };

@Injectable()
export class ReplaceForUserSql {
  constructor(private readonly dbService: DBService) {}

  // Return the complete active plan in the same shape used by clients for display and editing.
  /**
   * Adds workout.
   *
   * @param userId - The user identifier.
   * @param workoutData - The workout plan payload.
   * @returns The add workout result.
   */
  async replaceForUser(userId: string, workoutData: WorkoutSplitInput[]): Promise<{ replaced: true } | { invalidSplitId: number }> {
    const submittedExistingIds = workoutData.flatMap((split) => (split.id === undefined ? [] : [split.id]));

    if (submittedExistingIds.length > 0) {
      const ownedSplits = await this.dbService.sql<WorkoutSplitIdSqlRow[]>`
        SELECT
          split.id::INT
        FROM
          workout.workout_split split
          JOIN workout.workout_plan plan ON plan.id = split.workout_id
        WHERE
          split.id = ANY (${submittedExistingIds}::BIGINT[])
          AND plan.user_id = ${userId}::UUID
          AND plan.is_active = TRUE
        FOR UPDATE OF
          split,
          plan
      `;
      const ownedSplitIds = new Set(ownedSplits.map(({ id }) => id));
      const invalidSplitId = submittedExistingIds.find((id) => !ownedSplitIds.has(id));
      if (invalidSplitId !== undefined) return { invalidSplitId };
    }

    const [plan] = await this.dbService.sql<WorkoutPlanIdSqlRow[]>`
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

    await this.dbService.sql`
      UPDATE workout.workout_split
      SET
        is_active = FALSE,
        updated_at = NOW()
      WHERE
        workout_id = ${plan.id}
        AND is_active = TRUE
        AND NOT (id = ANY (${submittedExistingIds}::BIGINT[]));
    `;

    if (submittedExistingIds.length > 0) {
      // Free the active order indexes first, so simple swaps such as 0 <-> 1
      // cannot collide with the active-plan unique index during row updates.
      await this.dbService.sql`
        UPDATE workout.workout_split
        SET
          order_index = - order_index - 1
        WHERE
          workout_id = ${plan.id}
          AND is_active = TRUE
          AND id = ANY (${submittedExistingIds}::BIGINT[]);
      `;
    }

    const savedSplits = [];
    for (const split of workoutData) {
      const id =
        split.id !== undefined ? await this.updateWorkoutSplit(plan.id, { ...split, id: split.id }) : await this.insertWorkoutSplit(plan.id, split);
      savedSplits.push({ id, exercises: split.exercises });
    }

    await this.replaceWorkoutExercises(plan.id, savedSplits);
    return { replaced: true };
  }
  /**
   * Inserts a workout split and returns its identifier.
   *
   * @param planId - The workout plan identifier.
   * @param split - The workout split to persist.
   * @returns The insert workout split result.
   */
  private async insertWorkoutSplit(planId: number, split: WorkoutSplitInput): Promise<number> {
    // A split without an ID is new and receives a stable database identity.
    const [{ id }] = await this.dbService.sql<WorkoutSplitIdSqlRow[]>`
      INSERT INTO
        workout.workout_split (workout_id, name, order_index, is_active)
      VALUES
        (
          ${planId},
          ${split.name},
          ${split.orderIndex},
          TRUE
        )
      RETURNING
        id;
    `;
    return id;
  }
  /**
   * Updates a workout split and returns its identifier.
   *
   * @param planId - The workout plan identifier.
   * @param split - The workout split to persist.
   * @returns The update workout split result.
   * @throws {Error} When the locked split cannot be updated.
   */
  private async updateWorkoutSplit(planId: number, split: ExistingWorkoutSplitInput): Promise<number> {
    // Preserve the split identity when it is renamed, reordered, or reactivated.
    const [updated] = await this.dbService.sql<WorkoutSplitIdSqlRow[]>`
      UPDATE workout.workout_split
      SET
        name = ${split.name},
        order_index = ${split.orderIndex},
        is_active = TRUE,
        updated_at = CASE
          WHEN name IS DISTINCT FROM ${split.name}
          OR order_index IS DISTINCT FROM ${split.orderIndex}
          OR is_active IS DISTINCT FROM TRUE THEN NOW()
          ELSE updated_at
        END
      WHERE
        id = ${split.id}::int8
        AND workout_id = ${planId}::int8
      RETURNING
        id;
    `;

    if (!updated) throw new Error(`Locked workout split ${split.id} could not be updated`);
    return updated.id;
  }
  /**
   * Replaces the exercises and sets assigned to workout splits.
   *
   * @param planId - The workout plan identifier.
   * @param splits - The workout splits to process.
   * @returns A promise that resolves when the operation completes.
   */
  private async replaceWorkoutExercises(planId: number, splits: Array<{ id: number; exercises: WorkoutExerciseInput[] }>): Promise<void> {
    const changedSplitIds: number[] = [];
    for (const split of splits) {
      const [{ exercises }] = await this.dbService.sql<ExistingExercisesSqlRow[]>`
        SELECT
          COALESCE(
            JSONB_AGG(
              JSONB_BUILD_OBJECT(
                'exerciseId',
                assignment.exercise_id::INT,
                'orderIndex',
                assignment.order_index::INT,
                'sets',
                (
                  SELECT
                    COALESCE(
                      JSONB_AGG(
                        workout_set.reps
                        ORDER BY
                          workout_set.order_index
                      ),
                      '[]'::JSONB
                    )
                  FROM
                    workout.workout_set
                  WHERE
                    workout_set.exercise_to_split_id = assignment.id
                )
              )
              ORDER BY
                assignment.order_index,
                assignment.exercise_id
            ) FILTER (
              WHERE
                assignment.id IS NOT NULL
            ),
            '[]'::JSONB
          ) AS exercises
        FROM
          workout.exercise_to_workout_split assignment
        WHERE
          assignment.workout_split_id = ${split.id}
          AND assignment.is_active = TRUE
      `;

      const normalizeExercises = (items: WorkoutExerciseInput[]) =>
        items
          .map((exercise) => ({
            exerciseId: Number(exercise.exerciseId),
            orderIndex: Number(exercise.orderIndex),
            sets: exercise.sets.map(Number),
          }))
          .sort((left, right) => left.orderIndex - right.orderIndex || left.exerciseId - right.exerciseId);

      if (JSON.stringify(normalizeExercises(exercises)) !== JSON.stringify(normalizeExercises(split.exercises))) {
        changedSplitIds.push(split.id);
      }
    }

    // Deactivate previous assignments; submitted exercises are reactivated below.
    await this.dbService.sql`
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

    for (const split of splits) {
      for (const exercise of split.exercises) {
        // Create this assignment or reactivate it with its latest exercise order.
        const [savedExercise] = await this.dbService.sql<ExerciseAssignmentIdSqlRow[]>`
          INSERT INTO
            workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
          VALUES
            (
              ${split.id},
              ${exercise.exerciseId},
              ${exercise.orderIndex},
              TRUE
            )
          ON CONFLICT (workout_split_id, exercise_id) DO UPDATE
          SET
            order_index = EXCLUDED.order_index,
            is_active = TRUE
          RETURNING
            id;
        `;

        // Replace planned sets so the submitted payload remains the source of truth.
        await this.dbService.sql`
          DELETE FROM workout.workout_set
          WHERE
            exercise_to_split_id = ${savedExercise.id};
        `;

        for (const [setIndex, reps] of exercise.sets.entries()) {
          await this.dbService.sql`
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

    if (changedSplitIds.length > 0) {
      await this.dbService.sql`
        UPDATE workout.workout_split
        SET
          updated_at = NOW()
        WHERE
          id = ANY (${changedSplitIds}::BIGINT[])
      `;
    }
  }
}
