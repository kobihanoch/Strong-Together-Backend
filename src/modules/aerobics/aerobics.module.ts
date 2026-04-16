import { Module } from '@nestjs/common';
import { AerobicsController } from './aerobics.controller.ts';
import { AerobicsQueries } from './aerobics.queries.ts';
import { AerobicsService } from './aerobics.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';

@Module({
  controllers: [AerobicsController],
  providers: [AerobicsQueries, AerobicsService, SessionQueries, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
  exports: [AerobicsService],
})
export class AerobicsModule {}
