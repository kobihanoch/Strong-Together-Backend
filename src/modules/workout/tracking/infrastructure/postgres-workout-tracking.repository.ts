import { Injectable } from '@nestjs/common';
import type {
  ExerciseHistory,
  FinishedWorkoutEntry,
  PersonalRecords,
  WorkoutHistory,
  WorkoutStatistics,
} from '../application/models/workout-tracking.models';
import { WorkoutTrackingRepository } from '../application/ports/workout-tracking.repository';
import { WorkoutTrackingSql } from './workout-tracking.sql';
/** PostgreSQL adapter for workout tracking. */ @Injectable()
export class PostgresWorkoutTrackingRepository implements WorkoutTrackingRepository {
  constructor(private readonly sql: WorkoutTrackingSql) {}
  findWorkoutHistory(u: string, d: number, t: string): Promise<WorkoutHistory> {
    return this.sql.findWorkoutHistory(u, d, t);
  }
  findExerciseHistory(u: string, d: number, t: string): Promise<ExerciseHistory> {
    return this.sql.findExerciseHistory(u, d, t);
  }
  findStatistics(u: string, d: number, t: string): Promise<WorkoutStatistics> {
    return this.sql.findWorkoutStatistics(u, d, t);
  }
  findPersonalRecords(u: string, t: string): Promise<PersonalRecords> {
    return this.sql.findPersonalRecords(u, t);
  }
  async saveCompletedWorkout(u: string, w: FinishedWorkoutEntry[], s: string | null, e: string | null): Promise<void> {
    await this.sql.createWorkoutSession(u, w, s, e);
  }
}
