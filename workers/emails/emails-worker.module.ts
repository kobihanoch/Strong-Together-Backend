import { Module } from '@nestjs/common';
import { EmailsModule } from '../../src/infrastructure/queues/emails/emails.module.ts';
import { EmailsWorkerService } from './emails-worker.ts';
import { MailerModule } from '../../src/infrastructure/mailer/mailer.module.ts';

@Module({
  imports: [EmailsModule, MailerModule],
  providers: [EmailsWorkerService],
  exports: [EmailsWorkerService],
})
export class EmailsWorkerModule {}
