/** Delayed workout-reminder job sent to the push queue. */
export interface NotificationPayload {
  userId: string;
  workoutScheduleId: string;
  occurrenceDate: string;
  reminderAt: string;
  title: string;
  body: string;
  delay?: number;
  expiresAt: number;
  requestId?: string;
}

/** Workout reminder selected for delayed notification delivery. */
export interface DueWorkoutReminder {
  userId: string;
  workoutScheduleId: string;
  occurrenceDate: string;
  reminderAt: Date;
  firstName: string;
  splitName: string;
}

/** Result of scheduling all currently due workout reminders. */
export interface PushBatchResult {
  success: true;
  message: string;
  reminderCount: number;
}
