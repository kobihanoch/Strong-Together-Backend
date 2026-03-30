import { NotificationPayload } from "../../types/dto/notifications.dto.ts";
import { createLogger } from "../../config/logger.ts";
import pushNotificationsQueue from "./pushNotificationsQueue.ts";

const logger = createLogger('queue:push-producer', {
  queue: 'pushNotificationsQueue',
});

// Add jobs to queue
export const enqueuePushNotifications = async (
  notifications: NotificationPayload[],
): Promise<void> => {
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
      { event: 'queue.jobs_enqueued', notificationCount: notifications.length },
      'Push notifications enqueued',
    );
  } catch (e) {
    logger.error(
      { err: e, event: 'queue.enqueue_failed', notificationCount: notifications.length },
      'Failed to enqueue push notifications',
    );
    throw e;
  }
};
