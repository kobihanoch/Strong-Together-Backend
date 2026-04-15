import { Module } from '@nestjs/common';
import { AerobicsController } from './aerobics.controller.ts';
import { AerobicsService } from './aerobics.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';

@Module({
  controllers: [AerobicsController],
  providers: [AerobicsService, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class AerobicsModule {}
