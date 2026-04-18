import { Injectable } from '@nestjs/common';
import { appConfig } from '../../../config/app.config';
import { createLogger } from '../../logger';
import { EmailsQueueService } from './emails-queue';
import { EmailPayload } from './emails.dtos';

@Injectable()
export class EmailsProducerService {
  private readonly logger = createLogger('queue:emails-producer', {
    queue: 'emailsQueue',
  });

  constructor(private readonly emailsQueueService: EmailsQueueService) {}

  // Add jobs to queue
  async enqueueEmails(emails: EmailPayload[]): Promise<void> {
    if (appConfig.isTest) {
      return;
    }

    const requestIds = [...new Set(emails.map((email) => email.requestId).filter(Boolean))];
    try {
      await this.emailsQueueService.emailsQueue.addBulk(
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
      this.logger.info(
        {
          event: 'queue.jobs_enqueued',
          emailCount: emails.length,
          ...(requestIds.length ? { requestIds } : {}),
        },
        'Emails enqueued',
      );
    } catch (e) {
      this.logger.error(
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
  }
}
