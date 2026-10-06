import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { ReminderSettingsResult } from '../../models/reminders.models';
import { RemindersQueries } from '../../ports/reminders.queries';
import { GetReminderSettingsQuery } from './get-reminder-settings.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves a user's reminder settings. */
@QueryHandler(GetReminderSettingsQuery)
export class GetReminderSettingsHandler implements IQueryHandler<GetReminderSettingsQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: RemindersQueries,
  ) {}

  /**
   * Retrieves reminder settings owned by a user.
   *
   * @param userId - The settings owner.
   * @returns The settings result, containing `null` when none exist.
   */
  async execute(query: GetReminderSettingsQuery): Promise<ReminderSettingsResult> {
    const { userId } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      return { reminderSettings: (await this.query.findByUser()) ?? null };
    });
  }
}
