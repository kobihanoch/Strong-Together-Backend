import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createLogger } from '../../src/infrastructure/logger';
import { MailerService } from '../../src/infrastructure/mailer/mailer.service';
import { EmailsQueueService } from '../../src/infrastructure/queues/emails/emails-queue';
import { captureWorkerException } from '../../src/infrastructure/sentry';

const logger = createLogger('worker:emails', {
  queue: 'emailsQueue',
});

@Injectable()
export class EmailsWorkerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(EmailsQueueService) private readonly emailsQueueService: EmailsQueueService,
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  async onModuleInit() {
    await this.runWorker();
    logger.info({ event: 'worker.started', concurrency: 5 }, 'Email worker is up');
  }

  async onModuleDestroy() {
    logger.info({ event: 'worker.closed', concurrency: 5 }, 'Email worker is closed');
  }

  private async runWorker() {
    const emailsQueue = this.emailsQueueService.emailsQueue;

    try {
      // Try to run the worker
      emailsQueue.process(5, async (job) => {
        const { to, subject, html, requestId } = job.data;
        const jobLogger = logger.child({
          jobId: String(job.id),
          to,
          subject,
          requestId,
          attempt: job.attemptsMade + 1,
        });
        const startedAt = process.hrtime.bigint();
        try {
          jobLogger.info({ event: 'job.started' }, 'Email job started');
          // Preventing overflowing of emails
          if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
            jobLogger.warn({ event: 'job.skipped_expired' }, 'Skipping expired email job');
            return;
          }

          await this.mailerService.sendMail({ to, subject, html });
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
    } catch (e) {
      if (e instanceof Error) {
        logger.error({ err: e, event: 'worker.start_failed' }, 'Email worker failed to start');
      }
      throw e;
    }
  }
}
