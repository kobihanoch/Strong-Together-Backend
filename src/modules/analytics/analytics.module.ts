import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.ts';
import { AnalyticsService } from './analytics.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class AnalyticsModule {}
