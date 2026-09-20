import type { WorkoutPlanResult } from '../models/workout-plan.models';

/** A generation-stable cache entry for one workout-plan request. */
export interface WorkoutPlanCacheEntry {
  get(): Promise<WorkoutPlanResult | null>;
  set(value: WorkoutPlanResult): Promise<void>;
}

/** Caches active workout-plan projections. */
export abstract class WorkoutPlanCache {
  abstract forUser(userId: string, timezone: string): Promise<WorkoutPlanCacheEntry>;
  abstract invalidateUser(userId: string): Promise<void>;
}
