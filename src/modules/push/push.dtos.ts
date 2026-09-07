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
