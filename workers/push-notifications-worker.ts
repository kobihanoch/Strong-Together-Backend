import pushNotificationsQueue from '../src/infrastructure/queues/push-notifications/push-notifications-queue.ts';
import { sendPushNotification } from '../src/modules/push/push.service.ts';
import { createLogger } from '../src/infrastructure/logger.ts';
import { captureWorkerException } from '../src/infrastructure/sentry.ts';

const logger = createLogger('worker:push-notifications', {
  queue: 'pushNotificationsQueue',
});

export const startPushWorker = async () => {
  try {
    // Try to run the worker
    pushNotificationsQueue.process(5, async (job) => {
      const { token, title, body, requestId } = job.data;
      const jobLogger = logger.child({ jobId: String(job.id), token, title, requestId, attempt: job.attemptsMade + 1 });
      const startedAt = process.hrtime.bigint();
      try {
        jobLogger.info({ event: 'job.started' }, 'Push notification job started');
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          jobLogger.warn({ event: 'job.skipped_expired' }, 'Skipping expired push notification job');
          return;
        }

        await sendPushNotification(token, title, body);
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
        jobLogger.info({ event: 'job.succeeded', durationMs: Number(durationMs.toFixed(2)) }, 'Push notification sent');
      } catch (e) {
        if (e instanceof Error) {
          const sentryEventId = captureWorkerException(e, {
            worker: 'push-notifications',
            jobId: String(job.id),
            requestId,
            queue: 'pushNotificationsQueue',
          });
          const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
          jobLogger.error(
            { err: e, event: 'job.failed', durationMs: Number(durationMs.toFixed(2)), sentryEventId },
            'Failed to send push notification',
          );
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
