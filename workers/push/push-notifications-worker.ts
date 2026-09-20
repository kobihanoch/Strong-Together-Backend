import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createLogger } from '../../src/infrastructure/logger';
import { PushNotificationsQueueService } from '../../src/infrastructure/queues/push-notifications/push-notifications-queue';
import { captureWorkerException } from '../../src/infrastructure/sentry';
import { PushRepository } from '../../src/modules/push/application/ports/push.repository';
import { sendPushNotification } from '../../src/modules/push/infrastructure/expo-push.sender';

const logger = createLogger('worker:push-notifications', {
  queue: 'pushNotificationsQueue',
});

@Injectable()
export class PushNotificationsWorkerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly pushNotificationsQueueService: PushNotificationsQueueService,
    private readonly pushRepository: PushRepository,
  ) {}

  async onModuleInit() {
    await this.runWorker();
    logger.info({ event: 'worker.started', concurrency: 5 }, 'Push worker is up');
  }

  async onModuleDestroy() {
    logger.info({ event: 'worker.closed', concurrency: 5 }, 'Push worker is closed');
  }

  private async runWorker() {
    const pushNotificationsQueue = this.pushNotificationsQueueService.pushNotificationsQueue;

    try {
      // Try to run the worker
      pushNotificationsQueue.process(5, async (job) => {
        const { userId, workoutScheduleId, occurrenceDate, title, body, requestId } = job.data;
        const jobLogger = logger.child({
          jobId: String(job.id),
          userId,
          title,
          requestId,
          attempt: job.attemptsMade + 1,
        });
        const startedAt = process.hrtime.bigint();
        try {
          jobLogger.info({ event: 'job.started' }, 'Push notification job started');
          // Preventing overflowing of emails
          if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
            jobLogger.warn({ event: 'job.skipped_expired' }, 'Skipping expired push notification job');
            return;
          }

          // Recheck the user's current settings and schedule after the job delay.
          const token = await this.pushRepository.findEligibleExpoPushToken(userId, workoutScheduleId, occurrenceDate);
          if (!token) {
            jobLogger.info({ event: 'job.skipped_ineligible' }, 'Skipping ineligible workout reminder');
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
    } catch (e) {
      if (e instanceof Error) {
        logger.error({ err: e, event: 'worker.start_failed' }, 'Push worker failed to start');
      }
      throw e;
    }
  }
}
