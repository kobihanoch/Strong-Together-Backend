import type { ExerciseHistory, FinishedWorkoutEntry, PersonalRecords, WorkoutHistory, WorkoutStatistics } from '../models/workout-tracking.models';
/** Provides workout-tracking persistence operations. */
export abstract class WorkoutTrackingRepository {
  abstract findWorkoutHistory(userId: string, days: number, timezone: string): Promise<WorkoutHistory>;
  abstract findExerciseHistory(userId: string, days: number, timezone: string): Promise<ExerciseHistory>;
  abstract findStatistics(userId: string, days: number, timezone: string): Promise<WorkoutStatistics>;
  abstract findPersonalRecords(userId: string, timezone: string): Promise<PersonalRecords>;
  abstract saveCompletedWorkout(userId: string, workout: FinishedWorkoutEntry[], start: string | null, end: string | null): Promise<void>;
}
