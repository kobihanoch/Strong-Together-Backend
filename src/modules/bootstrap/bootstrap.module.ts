import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { AerobicsModule } from '../aerobics/aerobics.module';
import { MessagesModule } from '../messages/messages.module';
import { UserModule } from '../user/user.module';
import { WorkoutModule } from '../workout/workout.module';
import { BootstrapController } from './bootstrap.controller';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [AerobicsModule, AuthGuardsModule, MessagesModule, UserModule, WorkoutModule],
  controllers: [BootstrapController],
  providers: [BootstrapService, DpopGuard, RlsTxInterceptor],
})
export class BootstrapModule {}
