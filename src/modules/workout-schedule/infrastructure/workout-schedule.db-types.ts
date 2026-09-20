import { workoutSchedule } from '../../../infrastructure/db/schema/drizzle/schedules/workout_schedule/table';

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
