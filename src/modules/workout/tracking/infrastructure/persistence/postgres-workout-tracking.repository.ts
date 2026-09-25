import { Injectable } from '@nestjs/common';
import { CreateWorkoutSessionSql } from './writes/create-workout-session.sql';
import { WorkoutTrackingRepository } from '../../application/ports/workout-tracking.repository';
import type { CompletedWorkoutSession } from '../../domain/entities/completed-workout-session';
import type { FinishedWorkoutSqlInput } from './workout-tracking.db-types';
/** PostgreSQL adapter for workout tracking. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutTrackingRepository implements WorkoutTrackingRepository {
  public constructor(private readonly createWorkoutSessionSql: CreateWorkoutSessionSql) {}
  async saveCompletedWorkout(userId: string, session: CompletedWorkoutSession): Promise<void> {
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

    await this.createWorkoutSessionSql.createWorkoutSession(userId, workout, session.period.startUtc, session.period.endUtc);
  }
}
