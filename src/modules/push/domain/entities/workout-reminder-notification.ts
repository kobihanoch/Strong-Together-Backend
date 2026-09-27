import { NotificationMessage } from '../value-objects/notification-message';

/** Due reminder values required to prepare a queue notification. */
export interface DueWorkoutReminderValues {
  userId: string;
  workoutScheduleId: string;
  occurrenceDate: string;
  reminderAt: Date;
  firstName: string;
  splitName: string;
}

/** Delayed workout reminder prepared for queue delivery. */
export class WorkoutReminderNotification {
  public readonly userId: string;
  public readonly workoutScheduleId: string;
  public readonly occurrenceDate: string;
  public readonly reminderAt: string;
  public readonly message: NotificationMessage;
  public readonly delay: number;
  public readonly requestId?: string | undefined;

  public constructor(reminder: DueWorkoutReminderValues, now: number, requestId?: string) {
    this.userId = reminder.userId;
    this.workoutScheduleId = reminder.workoutScheduleId;
    this.occurrenceDate = reminder.occurrenceDate;
    this.reminderAt = reminder.reminderAt.toISOString();
    this.message = new NotificationMessage(`Hello, ${reminder.firstName}!`, `Your ${reminder.splitName} workout starts soon.`);
    this.delay = Math.max(0, reminder.reminderAt.getTime() - now);
    this.requestId = requestId;
  }

}
