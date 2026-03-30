import { sendMail } from '../src/config/mailer.ts';
import emailsQueue from '../src/queues/emails/emailsQueue.ts';
import { createLogger } from '../src/config/logger.ts';

const logger = createLogger('worker:emails', {
  queue: 'emailsQueue',
});

export const startEmailWorker = async () => {
  try {
    // Try to run the worker
    emailsQueue.process(5, async (job) => {
      const { to, subject, html } = job.data;
      const jobLogger = logger.child({ jobId: String(job.id), to, subject, attempt: job.attemptsMade + 1 });
      try {
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          jobLogger.warn({ event: 'queue.job_expired' }, 'Skipping expired email job');
          return;
        }

        await sendMail({ to, subject, html });
        jobLogger.info({ event: 'queue.job_sent' }, 'Email sent');
      } catch (e) {
        if (e instanceof Error) {
          jobLogger.error({ err: e, event: 'queue.job_failed' }, 'Failed to send email');
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
