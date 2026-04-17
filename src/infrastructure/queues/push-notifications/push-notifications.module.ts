import { Module } from '@nestjs/common';
import { PushNotificationsProducerService } from './push-notifications-producer.ts';
import { PushNotificationsQueueService } from './push-notifications-queue.ts';

@Module({
  providers: [PushNotificationsQueueService, PushNotificationsProducerService],
  exports: [PushNotificationsQueueService, PushNotificationsProducerService],
})
export class PushNotificationsModule {}
