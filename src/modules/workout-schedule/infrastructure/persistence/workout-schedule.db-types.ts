import { workoutSchedule } from '../../../../infrastructure/persistence/schema/drizzle/schedules/workout_schedule/table';

/** Represents the workout schedule db row value. */
type WorkoutScheduleDbRow = typeof workoutSchedule.$inferSelect;

/** Serialized schedule row returned by workout-schedule SQL. */
export type WorkoutScheduleSqlRow = Omit<WorkoutScheduleDbRow, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

/** Split-count projection used to validate a replacement schedule. */
export type ActiveWorkoutSplitCountSqlRow = {
  count: number;
};
