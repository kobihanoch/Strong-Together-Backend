import type { WorkoutPlan } from '../../domain/entities/workout-plan';
/** Provides persistence operations for active workout plans. */
export abstract class WorkoutPlanRepository {
  abstract findForUpdate(): Promise<WorkoutPlan | undefined>;
  abstract save(plan: WorkoutPlan): Promise<void>;
}
