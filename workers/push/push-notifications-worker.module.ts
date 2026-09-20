import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/queues/push-notifications/push-notifications.module';
import { PushNotificationsWorkerService } from './push-notifications-worker';
import { DBModule } from '../../src/infrastructure/db/db.module';
import { PushRepository } from '../../src/modules/push/application/ports/push.repository';
import { PostgresPushRepository } from '../../src/modules/push/infrastructure/postgres-push.repository';
import { PushSql } from '../../src/modules/push/infrastructure/push.sql';

@Module({
  imports: [DBModule, PushNotificationsModule],
  providers: [
    PushNotificationsWorkerService,
    PushSql,
    {
      provide: PushRepository,
      useClass: PostgresPushRepository,
    },
  ],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
