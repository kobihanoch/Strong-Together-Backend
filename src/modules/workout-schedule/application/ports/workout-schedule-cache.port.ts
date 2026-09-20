import type { WorkoutSchedules } from '../models/workout-schedule.models';

/** A generation-stable cache entry for one user's active workout schedule. */
export interface WorkoutScheduleCacheEntry {
  get(): Promise<WorkoutSchedules | null>;
  set(value: WorkoutSchedules): Promise<void>;
}

/** Cache operations required by workout-schedule use cases. */
export abstract class WorkoutScheduleCache {
  public abstract forUser(userId: string): Promise<WorkoutScheduleCacheEntry>;
  public abstract invalidateUser(userId: string): Promise<void>;
}
