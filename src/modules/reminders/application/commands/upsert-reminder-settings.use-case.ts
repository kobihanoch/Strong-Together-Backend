import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { UpsertReminderSettingsInput } from '../models/reminders.models';
import { RemindersRepository } from '../ports/reminders.repository';
import { ReminderSettings } from '../../domain/entities/reminder-settings';

/** Creates or replaces a user's reminder settings. */
@Injectable()
export class UpsertReminderSettingsUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: RemindersRepository,
  ) {}

  /**
   * Persists the complete reminder-settings state for a user.
   *
   * @param userId - The settings owner.
   * @param settings - The settings to persist.
   * @returns Nothing.
   */
  async execute(userId: string, settings: UpsertReminderSettingsInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const current = await this.repository.findByUserForUpdate(userId);
      if (current) current.replace(settings);
      await this.repository.save(current ?? ReminderSettings.create(userId, settings));
    });
  }
}
