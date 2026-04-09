import { EmailPayload } from './emails.dtos.ts';
import { appConfig } from '../../../config/app.config.ts';
import { createLogger } from '../../logger.ts';
import emailQueue from './emails-queue.ts';

const logger = createLogger('queue:emails-producer', {
  queue: 'emailsQueue',
});

// Add jobs to queue
export const enqueueEmails = async (emails: EmailPayload[]): Promise<void> => {
  if (appConfig.isTest) {
    return;
  }

  const requestIds = [...new Set(emails.map((email) => email.requestId).filter(Boolean))];
  try {
    await emailQueue.addBulk(
      emails.map((e) => ({
        data: {
          ...e,
          expiresAt: Date.now() + 1000 * 60 * 60 * 12,
        }, // Expires after 12 hours if the worker is down
        opts: {
          attempts: 3,
          backoff: 5000,
          removeOnComplete: true,
          //removeOnFail: true,
        },
      })),
    );
    logger.info(
      {
        event: 'queue.jobs_enqueued',
        emailCount: emails.length,
        ...(requestIds.length ? { requestIds } : {}),
      },
      'Emails enqueued',
    );
  } catch (e) {
    logger.error(
      {
        err: e,
        event: 'queue.enqueue_failed',
        emailCount: emails.length,
        ...(requestIds.length ? { requestIds } : {}),
      },
      'Failed to enqueue emails',
    );
    throw e;
  }
};
