import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RemindersRepository } from './application/ports/reminders.repository';
import { GetReminderSettingsUseCase } from './application/queries/get-reminder-settings.use-case';
import { UpdateReminderTimeZoneUseCase } from './application/commands/update-reminder-time-zone.use-case';
import { UpsertReminderSettingsUseCase } from './application/commands/upsert-reminder-settings.use-case';
import { PostgresRemindersRepository } from './infrastructure/persistence/postgres-reminders.repository';
import { FindSettingsSql } from './infrastructure/persistence/reads/find-settings.sql';
import { FindByUserForUpdateSql } from './infrastructure/persistence/reads/find-by-user-for-update.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { RemindersController } from './presentation/reminders.controller';
import { RemindersQueries } from './application/ports/reminders.queries';
import { PostgresRemindersQueries } from './infrastructure/persistence/postgres-reminders.queries';

@Module({
  controllers: [RemindersController],
  providers: [
    { provide: RemindersQueries, useClass: PostgresRemindersQueries },
    GetReminderSettingsUseCase,
    UpsertReminderSettingsUseCase,
    UpdateReminderTimeZoneUseCase,
    FindSettingsSql,
    FindByUserForUpdateSql,
    SaveSql,
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
