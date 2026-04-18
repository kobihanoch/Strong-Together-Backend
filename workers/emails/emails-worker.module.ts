import { Module } from '@nestjs/common';
import { EmailsModule } from '../../src/infrastructure/queues/emails/emails.module';
import { EmailsWorkerService } from './emails-worker';
import { MailerModule } from '../../src/infrastructure/mailer/mailer.module';

@Module({
  imports: [EmailsModule, MailerModule],
  providers: [EmailsWorkerService],
  exports: [EmailsWorkerService],
})
export class EmailsWorkerModule {}
