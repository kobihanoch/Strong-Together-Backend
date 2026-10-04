import { Injectable } from '@nestjs/common';
import { CreateSql } from './writes/create.sql';
import { WorkoutTrackingRepository } from '../../application/ports/workout-tracking.repository';
import { WorkoutSession, type WorkoutSessionValues } from '../../domain/entities/workout-session';
import type { FinishedWorkoutSqlInput } from './workout-tracking.db-types';
/** PostgreSQL adapter for workout tracking. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutTrackingRepository implements WorkoutTrackingRepository {
  public constructor(private readonly createSql: CreateSql) {}

  async create(session: WorkoutSession): Promise<WorkoutSession> {
    const workout: FinishedWorkoutSqlInput[] = session.exercises.map((exercise) => {
      const values = {
        trackedSets: exercise.trackedSets.map((set) => ({ reps: set.reps, weight: set.weight, setIndex: set.setIndex })),
        notes: exercise.notes,
      };

      return exercise.reference.isExerciseAssignedToSplit
        ? {
            ...values,
            isExerciseAssignedToSplit: true,
            exerciseToSplitId: exercise.reference.exerciseToSplitId as number,
            exerciseId: exercise.reference.exerciseId,
          }
        : {
            ...values,
            isExerciseAssignedToSplit: false,
            exerciseToSplitId: null,
            exerciseId: exercise.reference.exerciseId as number,
          };
    });

    const id = await this.createSql.execute(session.firstAssignedExerciseId, workout, session.period.startUtc, session.period.endUtc);
    const values: WorkoutSessionValues = {
      workout,
      workoutStartUtc: session.period.startUtc,
      workoutEndUtc: session.period.endUtc,
    };
    return WorkoutSession.restore(id, values);
  }
}
