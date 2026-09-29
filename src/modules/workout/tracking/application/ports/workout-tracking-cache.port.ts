import type { ExerciseHistory, PersonalRecords, WorkoutHistory, WorkoutStatistics } from '../models/workout-tracking.models';

/** A generation-stable cache entry for one workout-tracking request. */
export interface WorkoutTrackingCacheEntry<T> {
  get(): Promise<T | null>;
  set(value: T): Promise<void>;
}

/** Cache entries used by workout-tracking read operations. */
export abstract class WorkoutTrackingCache {
  abstract workoutHistoryForUser(userId: string, days: number, timezone: string): Promise<WorkoutTrackingCacheEntry<WorkoutHistory>>;
  abstract workoutStatisticsForUser(userId: string, days: number, timezone: string): Promise<WorkoutTrackingCacheEntry<WorkoutStatistics>>;
  abstract exerciseHistoryForUser(userId: string, days: number, timezone: string): Promise<WorkoutTrackingCacheEntry<ExerciseHistory>>;
  abstract personalRecordsForUser(userId: string, timezone: string): Promise<WorkoutTrackingCacheEntry<PersonalRecords>>;
  abstract invalidateUser(userId: string): Promise<void>;
}
