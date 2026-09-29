import type { WorkoutPlan } from '../../domain/entities/workout-plan';
/** Provides persistence operations for active workout plans. */
export abstract class WorkoutPlanRepository {
  abstract findForUpdate(userId: string): Promise<WorkoutPlan | undefined>;
  abstract save(userId: string, plan: WorkoutPlan): Promise<void>;
}
