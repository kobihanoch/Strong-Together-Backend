import { Module } from '@nestjs/common';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { PushController } from './push.controller.ts';
import { PushQueries } from './push.queries.ts';
import { PushService } from './push.service.ts';

@Module({
  controllers: [PushController],
  providers: [PushQueries, PushService, RlsTxInterceptor],
})
export class PushModule {}
