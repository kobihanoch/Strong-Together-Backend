import type { WorkoutSession } from '../../domain/entities/workout-session';
/** Provides workout-tracking persistence operations. */
export abstract class WorkoutTrackingRepository {
  abstract create(userId: string, session: WorkoutSession): Promise<WorkoutSession>;
}
