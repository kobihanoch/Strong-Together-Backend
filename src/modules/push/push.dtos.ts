export type NotificationPayload = {
  userId: string;
  workoutScheduleId: string;
  occurrenceDate: string;
  reminderAt: string;
  title: string;
  body: string;
  delay?: number;
  expiresAt: number;
  requestId?: string;
};

/** Workout reminder selected for delayed push-notification delivery. */
export type DueWorkoutReminder = {
  userId: string;
  workoutScheduleId: string;
  occurrenceDate: string;
  reminderAt: Date;
  firstName: string;
  splitName: string;
};
