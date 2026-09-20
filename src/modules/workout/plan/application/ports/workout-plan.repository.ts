import type { WorkoutPlan, WorkoutSplitInput } from '../models/workout-plan.models';
/** Provides persistence operations for active workout plans. */
export abstract class WorkoutPlanRepository {
  abstract findActiveByUser(userId: string, timezone: string): Promise<WorkoutPlan | null>;
  abstract replaceForUser(userId: string, splits: WorkoutSplitInput[]): Promise<void>;
}
