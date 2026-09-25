import type { ReplaceWorkoutPlanOutcome, WorkoutSplitInput } from '../models/workout-plan.models';
/** Provides persistence operations for active workout plans. */
export abstract class WorkoutPlanRepository {
  abstract replaceForUser(userId: string, splits: WorkoutSplitInput[]): Promise<ReplaceWorkoutPlanOutcome>;
}
