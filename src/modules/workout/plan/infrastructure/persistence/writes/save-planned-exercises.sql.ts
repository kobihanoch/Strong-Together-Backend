import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PersistedWorkoutSplitSqlInput, SavedExerciseSqlRow } from '../workout-plan.db-types';

/** Replaces exercise assignments and sets for the persisted active splits. */
@Injectable()
export class SavePlannedExercisesSql {
  constructor(private readonly dbService: DBService) {}

  async execute(planId: number, splits: PersistedWorkoutSplitSqlInput[]): Promise<void> {
    // Step 1: deactivate every previous assignment because the request is a complete snapshot.
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
            workout_id = ${planId}::BIGINT
        )
    `;

    // Step 2: flatten exercises from all active splits for one bulk upsert.
    const exercises = splits.flatMap((split) => split.exercises.map((exercise) => ({ ...exercise, splitId: split.id })));

    // Step 3: insert new assignments and reactivate/update assignments that already exist.
    const savedExercises = await this.dbService.sql<SavedExerciseSqlRow[]>`
      INSERT INTO
        workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
      SELECT
        input.split_id,
        input.exercise_id,
        input.order_index,
        TRUE
      FROM
        UNNEST(
          ${exercises.map((exercise) => exercise.splitId)}::BIGINT[],
          ${exercises.map((exercise) => exercise.exerciseId)}::BIGINT[],
          ${exercises.map((exercise) => exercise.orderIndex)}::BIGINT[]
        ) AS input (split_id, exercise_id, order_index)
      ON CONFLICT (workout_split_id, exercise_id) DO UPDATE
      SET
        order_index = EXCLUDED.order_index,
        is_active = TRUE
      RETURNING
        id::INT,
        workout_split_id::INT AS "splitId",
        exercise_id::INT AS "exerciseId"
    `;

    // Step 4: connect every submitted set to the assignment ID returned by PostgreSQL.
    const assignmentIds = new Map(savedExercises.map((exercise) => [`${exercise.splitId}:${exercise.exerciseId}`, exercise.id]));
    const sets = exercises.flatMap((exercise) => {
      const assignmentId = assignmentIds.get(`${exercise.splitId}:${exercise.exerciseId}`);
      if (assignmentId === undefined) throw new Error('A workout exercise assignment was not persisted');
      return exercise.sets.map((reps, orderIndex) => ({ assignmentId, orderIndex, reps }));
    });

    // Step 5: delete the previous sets for submitted assignments.
    await this.dbService.sql`
      DELETE FROM workout.workout_set
      WHERE
        exercise_to_split_id = ANY (${savedExercises.map((exercise) => exercise.id)}::BIGINT[])
    `;

    // Step 6: insert the complete submitted set list in one bulk operation.
    await this.dbService.sql`
      INSERT INTO
        workout.workout_set (exercise_to_split_id, order_index, reps)
      SELECT
        input.assignment_id,
        input.order_index,
        input.reps
      FROM
        UNNEST(
          ${sets.map((set) => set.assignmentId)}::BIGINT[],
          ${sets.map((set) => set.orderIndex)}::INT[],
          ${sets.map((set) => set.reps)}::INT[]
        ) AS input (assignment_id, order_index, reps)
    `;
  }
}
