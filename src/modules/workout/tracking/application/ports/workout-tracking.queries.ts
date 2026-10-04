import type { ExerciseHistory, PersonalRecords, WorkoutHistory, WorkoutStatistics } from '../models/workout-tracking.models';

/** Read operations required by application queries. */
export abstract class WorkoutTrackingQueries {
  abstract findWorkoutHistory(days: number, timezone: string): Promise<WorkoutHistory>;
  abstract findExerciseHistory(days: number, timezone: string): Promise<ExerciseHistory>;
  abstract findStatistics(days: number, timezone: string): Promise<WorkoutStatistics>;
  abstract findPersonalRecords(timezone: string): Promise<PersonalRecords>;
}
