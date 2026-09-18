import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/queues/push-notifications/push-notifications.module';
import { PushNotificationsWorkerService } from './push-notifications-worker';
import { DBModule } from '../../src/infrastructure/db/db.module';
import { PostgresPushRepository } from '../../src/modules/push/postgres-push.repository';
import { PushQueries } from '../../src/modules/push/push.queries';
import { PushRepository } from '../../src/modules/push/push.repository';

@Module({
  imports: [DBModule, PushNotificationsModule],
  providers: [
    PushNotificationsWorkerService,
    PushQueries,
    {
      provide: PushRepository,
      useClass: PostgresPushRepository,
    },
  ],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
