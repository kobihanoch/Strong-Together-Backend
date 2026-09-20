import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RemindersRepository } from './application/ports/reminders.repository';
import { GetReminderSettingsUseCase } from './application/use-cases/get-reminder-settings.use-case';
import { UpdateReminderTimeZoneUseCase } from './application/use-cases/update-reminder-time-zone.use-case';
import { UpsertReminderSettingsUseCase } from './application/use-cases/upsert-reminder-settings.use-case';
import { PostgresRemindersRepository } from './infrastructure/postgres-reminders.repository';
import { RemindersSql } from './infrastructure/reminders.sql';
import { RemindersController } from './presentation/reminders.controller';

@Module({
  controllers: [RemindersController],
  providers: [
    GetReminderSettingsUseCase,
    UpsertReminderSettingsUseCase,
    UpdateReminderTimeZoneUseCase,
    RemindersSql,
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
