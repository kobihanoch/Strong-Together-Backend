import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { RemindersController } from './reminders.controller';
import { RemindersQueries } from './reminders.queries';
import { RemindersService } from './reminders.service';

@Module({
  imports: [AuthGuardsModule],
  controllers: [RemindersController],
  providers: [RemindersService, RemindersQueries, DpopGuard, RlsTxInterceptor],
})
export class RemindersModule {}
