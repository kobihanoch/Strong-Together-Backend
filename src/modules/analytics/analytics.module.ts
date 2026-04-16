import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { AnalyticsController } from './analytics.controller.ts';
import { AnalyticsService } from './analytics.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { AnalyticsQueries } from './analytics.queries.ts';

@Module({
  imports: [AuthGuardsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsQueries, AnalyticsService, DpopGuard, RlsTxInterceptor],
})
export class AnalyticsModule {}
