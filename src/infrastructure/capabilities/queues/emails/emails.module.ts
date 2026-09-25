import { Module } from '@nestjs/common';
import { EmailsProducerService } from './emails-producer';
import { EmailsQueueService } from './emails-queue';

@Module({
  providers: [EmailsQueueService, EmailsProducerService],
  exports: [EmailsQueueService, EmailsProducerService],
})
export class EmailsModule {}
