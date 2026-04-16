import { Module } from '@nestjs/common';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { PushNotificationsModule } from '../../infrastructure/queues/push-notifications/push-notifications.module.ts';
import { PushController } from './push.controller.ts';
import { PushQueries } from './push.queries.ts';
import { PushService } from './push.service.ts';

@Module({
  imports: [PushNotificationsModule],
  controllers: [PushController],
  providers: [PushQueries, PushService, RlsTxInterceptor],
})
export class PushModule {}
