import { Module } from '@nestjs/common';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { PushNotificationsModule } from '../../infrastructure/queues/push-notifications/push-notifications.module';
import { PushController } from './push.controller';
import { PushQueries } from './push.queries';
import { PushService } from './push.service';

@Module({
  imports: [PushNotificationsModule],
  controllers: [PushController],
  providers: [PushQueries, PushService, RlsTxInterceptor],
})
export class PushModule {}
