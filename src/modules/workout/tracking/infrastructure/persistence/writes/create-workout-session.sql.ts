import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { FinishedWorkoutEntry } from '../../../application/models/workout-tracking.models';
import type { ExerciseTrackingIdSqlRow, WorkoutSplitLookupSqlRow, WorkoutSummaryIdSqlRow } from '../workout-tracking.db-types';

@Injectable()
export class CreateWorkoutSessionSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Inserts user finished workout.
   *
   * @param userId - The user identifier.
   * @param workoutArray - The completed workout records.
   * @param workoutStartUtc - The workout start utc.
   * @param workoutEndUtc - The workout end utc.
   * @returns The insert user finished workout result.
   */
  async createWorkoutSession(
    userId: string,
    workoutArray: FinishedWorkoutEntry[],
    workoutStartUtc: string | null,
    workoutEndUtc: string | null,
  ): Promise<string> {
    // Resolve the workout split that owns the exercises in the finished workout.
    const firstAssignedExercise = workoutArray.find((exercise) => exercise.isExerciseAssignedToSplit);
    const [{ workoutSplitId }] = await this.dbService.sql<WorkoutSplitLookupSqlRow[]>`
      SELECT
        workout_split_id AS "workoutSplitId"
      FROM
        workout.exercise_to_workout_split
      WHERE
        id = ${firstAssignedExercise?.exerciseToSplitId ?? null}
      LIMIT
        1;
    `;

    // Create the parent summary for the completed workout.
    const [{ id: workoutSummaryId }] = await this.dbService.sql<WorkoutSummaryIdSqlRow[]>`
      INSERT INTO
        tracking.workout_summary (
          user_id,
          workout_start_utc,
          workout_end_utc,
          workout_split_id
        )
      VALUES
        (
          ${userId}::UUID,
          ${workoutStartUtc}::TIMESTAMPTZ,
          ${workoutEndUtc}::TIMESTAMPTZ,
          ${workoutSplitId}::int8
        )
      RETURNING
        id;
    `;

    for (const exercise of workoutArray) {
      // Create one tracking record for this exercise; its sets are inserted next.
      const [{ id: exerciseTrackingId }] = await this.dbService.sql<ExerciseTrackingIdSqlRow[]>`
        INSERT INTO
          tracking.exercise_tracking (
            exercise_to_split_id,
            exercise_id,
            notes,
            workout_summary_id
          )
        VALUES
          (
            ${exercise.isExerciseAssignedToSplit ? exercise.exerciseToSplitId : null},
            ${exercise.isExerciseAssignedToSplit ? null : exercise.exerciseId},
            ${exercise.notes ?? ''},
            ${workoutSummaryId}::UUID
          )
        RETURNING
          id;
      `;

      for (const trackedSet of exercise.trackedSets) {
        // Store the reps and weight for one performed set at its zero-based index.
        await this.dbService.sql`
          INSERT INTO
            tracking.tracking_set (exercise_tracking_id, set_index, reps, weight)
          VALUES
            (
              ${exerciseTrackingId},
              ${trackedSet.setIndex},
              ${trackedSet.reps},
              ${trackedSet.weight}
            );
        `;
      }
    }

    return workoutSummaryId;
  }
}
