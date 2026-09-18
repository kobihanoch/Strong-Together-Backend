import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RemindersController } from './reminders.controller';
import { PostgresRemindersRepository } from './postgres-reminders.repository';
import { RemindersQueries } from './reminders.queries';
import { RemindersRepository } from './reminders.repository';
import { RemindersService } from './reminders.service';

@Module({
  controllers: [RemindersController],
  providers: [
    RemindersService,
    RemindersQueries,
    {
      provide: RemindersRepository,
      useClass: PostgresRemindersRepository,
    },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class RemindersModule {}
