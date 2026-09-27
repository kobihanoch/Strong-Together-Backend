import type { WorkoutReminderNotification } from '../../domain/entities/workout-reminder-notification';

/** Enqueues delayed workout-reminder notifications. */
export abstract class WorkoutReminderQueue {
  abstract enqueue(notifications: WorkoutReminderNotification[]): Promise<void>;
}
