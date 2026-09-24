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

/** Notification data accepted by a push-delivery provider. */
export interface PushNotificationInput {
  token: string;
  title: string;
  body: string;
}

/** Provider-level result of attempting to deliver one push notification. */
export type SendPushNotificationOutcome =
  { kind: 'sent'; ticketId: string | null } | { kind: 'permanent-failure'; reason: string } | { kind: 'temporarily-unavailable'; reason: string };

/** Non-retryable result returned by the push-delivery use case. */
export type SendPushNotificationResult = Exclude<SendPushNotificationOutcome, { kind: 'temporarily-unavailable' }>;
