import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { AerobicsModule } from '../aerobics/aerobics.module.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { UserModule } from '../user/user.module.ts';
import { WorkoutModule } from '../workout/workout.module.ts';
import { BootstrapController } from './bootstrap.controller.ts';
import { BootstrapService } from './bootstrap.service.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';

@Module({
  imports: [AerobicsModule, MessagesModule, UserModule, WorkoutModule],
  controllers: [BootstrapController],
  providers: [BootstrapService, SessionQueries, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class BootstrapModule {}
