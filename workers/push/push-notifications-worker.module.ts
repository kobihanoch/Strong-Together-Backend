import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/queues/push-notifications/push-notifications.module';
import { PushNotificationsWorkerService } from './push-notifications-worker';
import { DBModule } from '../../src/infrastructure/db/db.module';
import { PushRepository } from '../../src/modules/push/application/ports/push.repository';
import { PostgresPushRepository } from '../../src/modules/push/infrastructure/postgres-push.repository';
import { PushSql } from '../../src/modules/push/infrastructure/push.sql';
import { FindEligiblePushTokenUseCase } from '../../src/modules/push/application/use-cases/find-eligible-push-token.use-case';
import { SendPushNotificationUseCase } from '../../src/modules/push/application/use-cases/send-push-notification.use-case';
import { PushNotificationSender } from '../../src/modules/push/application/ports/push-notification-sender.port';
import { ExpoPushNotificationSender } from '../../src/modules/push/infrastructure/expo-push-notification.sender';

@Module({
  imports: [DBModule, PushNotificationsModule],
  providers: [
    PushNotificationsWorkerService,
    FindEligiblePushTokenUseCase,
    SendPushNotificationUseCase,
    PushSql,
    {
      provide: PushRepository,
      useClass: PostgresPushRepository,
    },
    {
      provide: PushNotificationSender,
      useClass: ExpoPushNotificationSender,
    },
  ],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
