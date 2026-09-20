import { Injectable } from '@nestjs/common';
import { PushNotificationsProducerService } from '../../../infrastructure/queues/push-notifications/push-notifications-producer';
import type { NotificationPayload } from '../application/models/push.models';
import { WorkoutReminderQueue } from '../application/ports/workout-reminder-queue.port';

/** Bull-backed adapter for delayed workout-reminder delivery. */
@Injectable()
export class BullWorkoutReminderQueue implements WorkoutReminderQueue {
  constructor(private readonly pushNotificationsProducer: PushNotificationsProducerService) {}

  enqueue(notifications: NotificationPayload[]): Promise<void> {
    return this.pushNotificationsProducer.enqueuePushNotifications(notifications);
  }
}
