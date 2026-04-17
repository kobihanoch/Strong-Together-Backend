import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/queues/push-notifications/push-notifications.module.ts';
import { PushNotificationsWorkerService } from './push-notifications-worker.ts';

@Module({
  imports: [PushNotificationsModule],
  providers: [PushNotificationsWorkerService],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
