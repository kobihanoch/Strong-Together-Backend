import { sendMail } from '../src/infrastructure/mailer.service.ts';
import emailsQueue from '../src/infrastructure/queues/emails/emails-queue.ts';
import { createLogger } from '../src/infrastructure/logger.ts';
import { captureWorkerException } from '../src/infrastructure/sentry.ts';

const logger = createLogger('worker:emails', {
  queue: 'emailsQueue',
});

export const startEmailWorker = async () => {
  try {
    // Try to run the worker
    emailsQueue.process(5, async (job) => {
      const { to, subject, html, requestId } = job.data;
      const jobLogger = logger.child({ jobId: String(job.id), to, subject, requestId, attempt: job.attemptsMade + 1 });
      const startedAt = process.hrtime.bigint();
      try {
        jobLogger.info({ event: 'job.started' }, 'Email job started');
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          jobLogger.warn({ event: 'job.skipped_expired' }, 'Skipping expired email job');
          return;
        }

        await sendMail({ to, subject, html });
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
        jobLogger.info({ event: 'job.succeeded', durationMs: Number(durationMs.toFixed(2)) }, 'Email sent');
      } catch (e) {
        if (e instanceof Error) {
          const sentryEventId = captureWorkerException(e, {
            worker: 'emails',
            jobId: String(job.id),
            requestId,
            queue: 'emailsQueue',
          });
          const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
          jobLogger.error(
            { err: e, event: 'job.failed', durationMs: Number(durationMs.toFixed(2)), sentryEventId },
            'Failed to send email',
          );
        }
        throw e;
      }
    });
    logger.info({ event: 'worker.started', concurrency: 5 }, 'Email worker is up');
  } catch (e) {
    if (e instanceof Error) {
      logger.error({ err: e, event: 'worker.start_failed' }, 'Email worker failed to start');
    }
    throw e;
  }

  return emailsQueue; // For shutdown
};
