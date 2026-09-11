import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { RemindersController } from './reminders.controller';
import { RemindersQueries } from './reminders.queries';
import { RemindersService } from './reminders.service';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService, RemindersQueries, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class RemindersModule {}
