import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/queues/push-notifications/push-notifications.module';
import { PushNotificationsWorkerService } from './push-notifications-worker';

@Module({
  imports: [PushNotificationsModule],
  providers: [PushNotificationsWorkerService],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
