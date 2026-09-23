import { Injectable } from '@nestjs/common';
import type { UpsertReminderSettingsInput } from '../models/reminders.models';
import { RemindersRepository } from '../ports/reminders.repository';

/** Creates or replaces a user's reminder settings. */
@Injectable()
export class UpsertReminderSettingsUseCase {
  constructor(private readonly repository: RemindersRepository) {}

  /**
   * Persists the complete reminder-settings state for a user.
   *
   * @param userId - The settings owner.
   * @param settings - The settings to persist.
   * @returns Nothing.
   */
  async execute(userId: string, settings: UpsertReminderSettingsInput): Promise<void> {
    await this.repository.upsertForUser(userId, settings);
  }
}
