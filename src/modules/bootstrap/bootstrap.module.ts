import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { AerobicsModule } from '../aerobics/aerobics.module.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { UserModule } from '../user/user.module.ts';
import { WorkoutModule } from '../workout/workout.module.ts';
import { BootstrapController } from './bootstrap.controller.ts';
import { BootstrapService } from './bootstrap.service.ts';

@Module({
  imports: [AerobicsModule, AuthGuardsModule, MessagesModule, UserModule, WorkoutModule],
  controllers: [BootstrapController],
  providers: [BootstrapService, DpopGuard, RlsTxInterceptor],
})
export class BootstrapModule {}
