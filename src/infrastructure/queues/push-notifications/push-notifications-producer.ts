import { Injectable } from '@nestjs/common';
import type { NotificationPayload } from '../../../modules/push/push.dtos';
import { createLogger } from '../../logger';
import { PushNotificationsQueueService } from './push-notifications-queue';

@Injectable()
export class PushNotificationsProducerService {
  private readonly logger = createLogger('queue:push-producer', {
    queue: 'pushNotificationsQueue',
  });

  constructor(private readonly pushNotificationsQueueService: PushNotificationsQueueService) {}

  /**
   * Adds workout reminder jobs to the push queue.
   * @param notifications - The validated reminder jobs to enqueue.
   * @returns Resolves after all jobs are added to Redis.
   */
  async enqueuePushNotifications(notifications: NotificationPayload[]): Promise<void> {
    if (notifications.length === 0) return;

    const requestIds = [...new Set(notifications.map((notification) => notification.requestId).filter(Boolean))];
    try {
      await this.pushNotificationsQueueService.pushNotificationsQueue.addBulk(
        notifications.map((e) => ({
          data: {
            ...e,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 Hours
          }, // Expires after 10 mins if the worker is down
          opts: {
            jobId: `workout-reminder:${e.workoutScheduleId}:${e.occurrenceDate}`,
            attempts: 3,
            backoff: 5000,
            // Keep the job through the cron overlap window so its jobId prevents duplicate sends.
            removeOnComplete: { age: 2 * 60 * 60, count: 10_000 },
            delay: e.delay || 0,
            //removeOnFail: true,
          },
        })),
      );
      this.logger.info(
        {
          event: 'queue.jobs_enqueued',
          notificationCount: notifications.length,
          ...(requestIds.length ? { requestIds } : {}),
        },
        'Push notifications enqueued',
      );
    } catch (e) {
      this.logger.error(
        {
          err: e,
          event: 'queue.enqueue_failed',
          notificationCount: notifications.length,
          ...(requestIds.length ? { requestIds } : {}),
        },
        'Failed to enqueue push notifications',
      );
      throw e;
    }
  }
}
