import { Injectable } from '@nestjs/common';
import { CreateWorkoutSessionSql } from './writes/create-workout-session.sql';
import type { FinishedWorkoutEntry } from '../../application/models/workout-tracking.models';
import { WorkoutTrackingRepository } from '../../application/ports/workout-tracking.repository';
/** PostgreSQL adapter for workout tracking. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutTrackingRepository implements WorkoutTrackingRepository {
  public constructor(private readonly createWorkoutSessionSql: CreateWorkoutSessionSql) {}
  async saveCompletedWorkout(u: string, w: FinishedWorkoutEntry[], s: string | null, e: string | null): Promise<void> {
    await this.createWorkoutSessionSql.createWorkoutSession(u, w, s, e);
  }
}
