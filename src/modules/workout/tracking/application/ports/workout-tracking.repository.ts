import type { CompletedWorkoutSession } from '../../domain/entities/completed-workout-session';
/** Provides workout-tracking persistence operations. */
export abstract class WorkoutTrackingRepository {
  abstract saveCompletedWorkout(userId: string, session: CompletedWorkoutSession): Promise<void>;
}
