import { Module } from '@nestjs/common';
import { EmailsProducerService } from './emails-producer.ts';
import { EmailsQueueService } from './emails-queue.ts';

@Module({
  providers: [EmailsQueueService, EmailsProducerService],
  exports: [EmailsQueueService, EmailsProducerService],
})
export class EmailsModule {}
