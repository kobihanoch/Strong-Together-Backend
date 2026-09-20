import type { NotificationPayload } from '../models/push.models';

/** Enqueues delayed workout-reminder notifications. */
export abstract class WorkoutReminderQueue {
  abstract enqueue(notifications: NotificationPayload[]): Promise<void>;
}
