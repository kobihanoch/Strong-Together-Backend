import type { ExerciseHistory, PersonalRecords, WorkoutHistory, WorkoutStatistics } from '../models/workout-tracking.models';

/** Read operations required by application queries. */
export abstract class WorkoutTrackingQueries {
  abstract findWorkoutHistory(userId: string, days: number, timezone: string): Promise<WorkoutHistory>;
  abstract findExerciseHistory(userId: string, days: number, timezone: string): Promise<ExerciseHistory>;
  abstract findStatistics(userId: string, days: number, timezone: string): Promise<WorkoutStatistics>;
  abstract findPersonalRecords(userId: string, timezone: string): Promise<PersonalRecords>;
}
