import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { AnalyticsQueries } from './analytics.queries';

@Module({
  imports: [AuthGuardsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsQueries, AnalyticsService, DpopGuard, RlsTxInterceptor],
})
export class AnalyticsModule {}
