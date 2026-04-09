import { NotificationPayload } from '../../../modules/push/push.dtos.ts';
import { createLogger } from '../../../infrastructure/logger.ts';
import pushNotificationsQueue from './push-notifications-queue.ts';

const logger = createLogger('queue:push-producer', {
  queue: 'pushNotificationsQueue',
});

// Add jobs to queue
export const enqueuePushNotifications = async (notifications: NotificationPayload[]): Promise<void> => {
  const requestIds = [...new Set(notifications.map((notification) => notification.requestId).filter(Boolean))];
  try {
    await pushNotificationsQueue.addBulk(
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
    logger.info(
      {
        event: 'queue.jobs_enqueued',
        notificationCount: notifications.length,
        ...(requestIds.length ? { requestIds } : {}),
      },
      'Push notifications enqueued',
    );
  } catch (e) {
    logger.error(
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
};
