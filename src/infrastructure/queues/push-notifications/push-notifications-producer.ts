import { Injectable } from '@nestjs/common';
import { NotificationPayload } from '../../../modules/push/push.dtos';
import { createLogger } from '../../logger';
import { PushNotificationsQueueService } from './push-notifications-queue';

@Injectable()
export class PushNotificationsProducerService {
  private readonly logger = createLogger('queue:push-producer', {
    queue: 'pushNotificationsQueue',
  });

  constructor(private readonly pushNotificationsQueueService: PushNotificationsQueueService) {}

  // Add jobs to queue
  async enqueuePushNotifications(notifications: NotificationPayload[]): Promise<void> {
    const requestIds = [...new Set(notifications.map((notification) => notification.requestId).filter(Boolean))];
    try {
      await this.pushNotificationsQueueService.pushNotificationsQueue.addBulk(
        notifications.map((e) => ({
          data: {
            ...e,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 Hours
          }, // Expires after 10 mins if the worker is down
          opts: {
            attempts: 3,
            backoff: 5000,
            removeOnComplete: true,
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
