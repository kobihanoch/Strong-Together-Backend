import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../src/infrastructure/capabilities/queues/push-notifications/push-notifications.module';
import { PushNotificationsWorkerService } from './push-notifications-worker';
import { DBModule } from '../../src/infrastructure/connections/postgres/db.module';
import { PushQueries } from '../../src/modules/push/application/ports/push.queries';
import { PostgresPushQueries } from '../../src/modules/push/infrastructure/persistence/postgres-push.queries';
import { FindDueWorkoutRemindersSql } from '../../src/modules/push/infrastructure/persistence/reads/find-due-workout-reminders.sql';
import { FindEligibleExpoPushTokenSql } from '../../src/modules/push/infrastructure/persistence/reads/find-eligible-expo-push-token.sql';
import { FindEligiblePushTokenUseCase } from '../../src/modules/push/application/queries/find-eligible-push-token.use-case';
import { SendPushNotificationUseCase } from '../../src/modules/push/application/commands/send-push-notification.use-case';
import { PushNotificationSender } from '../../src/modules/push/application/ports/push-notification-sender.port';
import { ExpoPushNotificationSender } from '../../src/modules/push/infrastructure/expo-push-notification.sender';

@Module({
  imports: [DBModule, PushNotificationsModule],
  providers: [
    PushNotificationsWorkerService,
    FindEligiblePushTokenUseCase,
    SendPushNotificationUseCase,
    FindDueWorkoutRemindersSql,
    FindEligibleExpoPushTokenSql,
    {
      provide: PushQueries,
      useClass: PostgresPushQueries,
    },
    {
      provide: PushNotificationSender,
      useClass: ExpoPushNotificationSender,
    },
  ],
  exports: [PushNotificationsWorkerService],
})
export class PushNotificationsWorkerModule {}
