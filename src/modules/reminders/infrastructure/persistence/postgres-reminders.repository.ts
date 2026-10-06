import { Injectable } from '@nestjs/common';
import { FindByUserForUpdateSql } from './reads/find-by-user-for-update.sql';
import { SaveSql } from './writes/save.sql';
import { RemindersRepository } from '../../application/ports/reminders.repository';
import { ReminderSettings } from '../../domain/entities/reminder-settings';

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresRemindersRepository implements RemindersRepository {
  public constructor(
    private readonly findByUserForUpdateSql: FindByUserForUpdateSql,
    private readonly saveSql: SaveSql,
  ) {}

  async findByUserForUpdate(): Promise<ReminderSettings | undefined> {
    const row = await this.findByUserForUpdateSql.findByUserForUpdate();
    return row ? ReminderSettings.restore(row.userId, row) : undefined;
  }

  save(settings: ReminderSettings): Promise<void> {
    return this.saveSql.save({
      reminderEnabled: settings.reminderEnabled,
      timeZone: settings.timeZone.value,
    });
  }
}
