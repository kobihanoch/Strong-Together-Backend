import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/queues/push-notifications/push-notifications.module';
import { PushNotificationsWorkerService } from './push-notifications-worker';
import { DBModule } from '../../src/infrastructure/db/db.module';
import { PushQueries } from '../../src/modules/push/push.queries';

@Module({
  imports: [DBModule, PushNotificationsModule],
  providers: [PushNotificationsWorkerService, PushQueries],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
