import type { WorkoutPlanReplacement } from '../../domain/entities/workout-plan-replacement';
import type { ReplaceWorkoutPlanOutcome } from '../models/workout-plan.models';
/** Provides persistence operations for active workout plans. */
export abstract class WorkoutPlanRepository {
  abstract replaceForUser(userId: string, plan: WorkoutPlanReplacement): Promise<ReplaceWorkoutPlanOutcome>;
}
