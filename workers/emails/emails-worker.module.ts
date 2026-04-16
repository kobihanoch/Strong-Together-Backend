import { Module } from '@nestjs/common';
import { EmailsModule } from '../../src/infrastructure/queues/emails/emails.module.ts';
import { EmailsWorkerService } from './emails-worker.ts';

@Module({
  imports: [EmailsModule],
  providers: [EmailsWorkerService],
  exports: [EmailsWorkerService],
})
export class EmailsWorkerModule {}
