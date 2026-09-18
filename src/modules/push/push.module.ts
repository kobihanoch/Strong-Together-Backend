import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../infrastructure/queues/push-notifications/push-notifications.module';
import { PostgresPushRepository } from './postgres-push.repository';
import { PushController } from './push.controller';
import { PushQueries } from './push.queries';
import { PushRepository } from './push.repository';
import { PushService } from './push.service';

@Module({
  imports: [PushNotificationsModule],
  controllers: [PushController],
  providers: [
    PushQueries,
    {
      provide: PushRepository,
      useClass: PostgresPushRepository,
    },
    PushService,
  ],
})
export class PushModule {}
