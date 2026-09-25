import { user } from '../../../../infrastructure/db/schema/drizzle/identity/user/table';
import { workoutSchedule } from '../../../../infrastructure/db/schema/drizzle/schedules/workout_schedule/table';

/** Represents the user db row value. */
type UserDbRow = typeof user.$inferSelect;
/** Represents the workout schedule db row value. */
type WorkoutScheduleDbRow = typeof workoutSchedule.$inferSelect;

/** Row returned by the due-workout-reminders database function. */
export interface DueWorkoutReminderSqlRow {
  userId: UserDbRow['id'];
  workoutScheduleId: WorkoutScheduleDbRow['id'];
  occurrenceDate: string;
  reminderAt: Date;
  firstName: UserDbRow['name'];
  splitName: string;
}

/** Row returned when checking whether a delayed reminder remains eligible. */
export interface EligiblePushTokenSqlRow {
  pushToken: UserDbRow['pushToken'];
}
