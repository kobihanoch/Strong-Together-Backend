import pushNotificationsQueue from '../src/queues/pushNotifications/pushNotificationsQueue.ts';
import { sendPushNotification } from '../src/services/pushService.ts';
import { createLogger } from '../src/config/logger.ts';

const logger = createLogger('worker:push-notifications', {
  queue: 'pushNotificationsQueue',
});

export const startPushWorker = async () => {
  try {
    // Try to run the worker
    pushNotificationsQueue.process(5, async (job) => {
      const { token, title, body } = job.data;
      const jobLogger = logger.child({ jobId: String(job.id), token, title, attempt: job.attemptsMade + 1 });
      try {
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          jobLogger.warn({ event: 'queue.job_expired' }, 'Skipping expired push notification job');
          return;
        }

        await sendPushNotification(token, title, body);
        jobLogger.info({ event: 'queue.job_sent' }, 'Push notification sent');
      } catch (e) {
        if (e instanceof Error) {
          jobLogger.error({ err: e, event: 'queue.job_failed' }, 'Failed to send push notification');
        }
        throw e;
      }
    });
    logger.info({ event: 'worker.started', concurrency: 5 }, 'Push worker is up');
  } catch (e) {
    if (e instanceof Error) {
      logger.error({ err: e, event: 'worker.start_failed' }, 'Push worker failed to start');
    }
    throw e;
  }

  return pushNotificationsQueue; // For shutdown
};
