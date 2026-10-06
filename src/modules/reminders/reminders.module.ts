import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RemindersRepository } from './application/ports/reminders.repository';
import { GetReminderSettingsHandler } from './application/queries/get-reminder-settings/get-reminder-settings.handler';
import { UpdateReminderTimeZoneHandler } from './application/commands/update-reminder-time-zone/update-reminder-time-zone.handler';
import { UpsertReminderSettingsHandler } from './application/commands/upsert-reminder-settings/upsert-reminder-settings.handler';
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
    GetReminderSettingsHandler,
    UpsertReminderSettingsHandler,
    UpdateReminderTimeZoneHandler,
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
