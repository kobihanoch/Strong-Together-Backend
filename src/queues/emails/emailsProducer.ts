import { EmailPayload } from '../../types/dto/emails.dto.ts';
import { createLogger } from '../../config/logger.ts';
import emailQueue from './emailsQueue.ts';

const logger = createLogger('queue:emails-producer', {
  queue: 'emailsQueue',
});

// Add jobs to queue
export const enqueueEmails = async (emails: EmailPayload[]): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

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
    logger.info({ event: 'queue.jobs_enqueued', emailCount: emails.length }, 'Emails enqueued');
  } catch (e) {
    logger.error({ err: e, event: 'queue.enqueue_failed', emailCount: emails.length }, 'Failed to enqueue emails');
    throw e;
  }
};
