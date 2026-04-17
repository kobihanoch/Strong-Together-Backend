import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { AerobicsController } from './aerobics.controller.ts';
import { AerobicsQueries } from './aerobics.queries.ts';
import { AerobicsService } from './aerobics.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';

@Module({
  imports: [AuthGuardsModule],
  controllers: [AerobicsController],
  providers: [AerobicsQueries, AerobicsService, DpopGuard, RlsTxInterceptor],
  exports: [AerobicsService],
})
export class AerobicsModule {}
