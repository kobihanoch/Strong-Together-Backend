import { Module } from '@nestjs/common';
import { PushNotificationsProducerService } from './push-notifications-producer';
import { PushNotificationsQueueService } from './push-notifications-queue';

@Module({
  providers: [PushNotificationsQueueService, PushNotificationsProducerService],
  exports: [PushNotificationsQueueService, PushNotificationsProducerService],
})
export class PushNotificationsModule {}
