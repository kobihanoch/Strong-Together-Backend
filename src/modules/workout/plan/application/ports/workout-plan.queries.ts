import type { WorkoutPlan } from '../models/workout-plan.models';

/** Read operations required by application queries. */
export abstract class WorkoutPlanQueries {
  abstract findActiveByUser(timezone: string): Promise<WorkoutPlan | null>;
}
