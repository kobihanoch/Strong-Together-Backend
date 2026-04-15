import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { AerobicsModule } from '../aerobics/aerobics.module.ts';
import { BootstrapController } from './bootstrap.controller.ts';
import { BootstrapService } from './bootstrap.service.ts';

@Module({
  imports: [AerobicsModule],
  controllers: [BootstrapController],
  providers: [BootstrapService, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class BootstrapModule {}
