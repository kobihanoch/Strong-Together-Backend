import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type {
  ExerciseTrackingIdSqlRow,
  FinishedWorkoutSqlInput,
  WorkoutSplitLookupSqlRow,
  WorkoutSummaryIdSqlRow,
} from '../workout-tracking.db-types';

/** Persists one completed workout session and returns its generated identity. */
@Injectable()
export class CreateSql {
  constructor(private readonly dbService: DBService) {}

  async execute(
    userId: string,
    firstAssignedExerciseId: number | undefined,
    workout: FinishedWorkoutSqlInput[],
    startUtc: string,
    endUtc: string | null,
  ): Promise<string> {
    // The first planned exercise determines which workout split this session completed.
    const [split] = await this.dbService.sql<WorkoutSplitLookupSqlRow[]>`
      SELECT
        workout_split_id AS "workoutSplitId"
      FROM
        workout.exercise_to_workout_split
      WHERE
        id = ${firstAssignedExerciseId ?? null}
      LIMIT
        1
    `;
    if (!split) throw new Error('Workout split was not found for the completed session');

    // Create the parent summary once; exercise and set rows reference this identity.
    const [summary] = await this.dbService.sql<WorkoutSummaryIdSqlRow[]>`
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
          ${startUtc}::TIMESTAMPTZ,
          ${endUtc}::TIMESTAMPTZ,
          ${split.workoutSplitId}::BIGINT
        )
      RETURNING
        id
    `;
    if (!summary) throw new Error('Workout session was not persisted');

    // Allocate IDs first so exercises and their sets can be correlated without per-row inserts.
    const sql = this.dbService.sql;
    const exerciseIds = await sql<ExerciseTrackingIdSqlRow[]>`
      SELECT
        NEXTVAL('tracking.exercise_tracking_id_seq')::INT AS id
      FROM
        GENERATE_SERIES(1, ${workout.length})
    `;
    const exercises = workout.map((exercise, index) => ({
      id: exerciseIds[index]?.id,
      exerciseToSplitId: exercise.isExerciseAssignedToSplit ? exercise.exerciseToSplitId : null,
      exerciseId: exercise.isExerciseAssignedToSplit ? null : exercise.exerciseId,
      notes: exercise.notes ?? '',
      trackedSets: exercise.trackedSets,
    }));
    if (exercises.some((exercise) => exercise.id === undefined)) throw new Error('Exercise tracking identity was not generated');

    // Insert all tracked exercises. This statement completes before set RLS checks run.
    await sql`
      INSERT INTO
        tracking.exercise_tracking (
          id,
          exercise_to_split_id,
          exercise_id,
          notes,
          workout_summary_id
        )
      SELECT
        input.id,
        input."exerciseToSplitId",
        input."exerciseId",
        input.notes,
        ${summary.id}::UUID
      FROM
        JSONB_TO_RECORDSET(${sql.json(exercises)}) AS input (
          id BIGINT,
          "exerciseToSplitId" BIGINT,
          "exerciseId" BIGINT,
          notes TEXT,
          "trackedSets" JSONB
        )
    `;

    const sets = exercises.flatMap((exercise) => exercise.trackedSets.map((set) => ({ ...set, exerciseTrackingId: exercise.id })));

    // Insert every tracked set in one statement after its parent rows are visible to RLS.
    await sql`
      INSERT INTO
        tracking.tracking_set (exercise_tracking_id, set_index, reps, weight)
      SELECT
        input."exerciseTrackingId",
        input."setIndex",
        input.reps,
        input.weight
      FROM
        JSONB_TO_RECORDSET(${sql.json(sets)}) AS input (
          "exerciseTrackingId" BIGINT,
          "setIndex" INT,
          reps INT,
          weight REAL
        )
    `;

    return summary.id;
  }
}
