import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { AerobicsController } from './aerobics.controller';
import { AerobicsQueries } from './aerobics.queries';
import { AerobicsService } from './aerobics.service';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';

@Module({
  imports: [AuthGuardsModule],
  controllers: [AerobicsController],
  providers: [AerobicsQueries, AerobicsService, DpopGuard, RlsTxInterceptor],
  exports: [AerobicsService],
})
export class AerobicsModule {}
