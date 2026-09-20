import { user } from '../../../infrastructure/db/schema/drizzle/identity/user/table';
import { workoutSchedule } from '../../../infrastructure/db/schema/drizzle/schedules/workout_schedule/table';

type UserDbRow = typeof user.$inferSelect;
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
