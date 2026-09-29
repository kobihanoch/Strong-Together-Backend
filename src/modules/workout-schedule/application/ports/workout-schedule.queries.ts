import type { WorkoutSchedule } from '../models/workout-schedule.models';

/** Read operations required by application queries. */
export abstract class WorkoutScheduleQueries {
  public abstract findByUser(userId: string): Promise<WorkoutSchedule[]>;
}
