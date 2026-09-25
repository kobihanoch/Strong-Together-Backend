import type { FinishedWorkoutEntry } from '../models/workout-tracking.models';
/** Provides workout-tracking persistence operations. */
export abstract class WorkoutTrackingRepository {
  abstract saveCompletedWorkout(userId: string, workout: FinishedWorkoutEntry[], start: string | null, end: string | null): Promise<void>;
}
