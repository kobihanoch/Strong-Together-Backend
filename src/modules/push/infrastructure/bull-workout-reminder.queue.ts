import { Injectable } from '@nestjs/common';
import { PushNotificationsProducerService } from '../../../infrastructure/capabilities/queues/push-notifications/push-notifications-producer';
import { WorkoutReminderQueue } from '../application/ports/workout-reminder-queue.port';
import type { WorkoutReminderNotification } from '../domain/entities/workout-reminder-notification';

/** Bull-backed adapter for delayed workout-reminder delivery. */
@Injectable()
export class BullWorkoutReminderQueue implements WorkoutReminderQueue {
  constructor(private readonly pushNotificationsProducer: PushNotificationsProducerService) {}

  enqueue(notifications: WorkoutReminderNotification[]): Promise<void> {
    return this.pushNotificationsProducer.enqueuePushNotifications(
      notifications.map((notification) => ({
        userId: notification.userId,
        workoutScheduleId: notification.workoutScheduleId,
        occurrenceDate: notification.occurrenceDate,
        reminderAt: notification.reminderAt,
        title: notification.message.title,
        body: notification.message.body,
        delay: notification.delay,
        expiresAt: 0,
        ...(notification.requestId ? { requestId: notification.requestId } : {}),
      })),
    );
  }
}
