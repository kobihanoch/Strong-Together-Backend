import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { ReminderSettingsResult } from '../models/reminders.models';
import { RemindersRepository } from '../ports/reminders.repository';

/** Retrieves a user's reminder settings. */
@Injectable()
export class GetReminderSettingsUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: RemindersRepository,
  ) {}

  /**
   * Retrieves reminder settings owned by a user.
   *
   * @param userId - The settings owner.
   * @returns The settings result, containing `null` when none exist.
   */
  async execute(userId: string): Promise<ReminderSettingsResult> {
    return this.unitOfWork.execute(userId, async () => {
      return { reminderSettings: await this.repository.findByUser(userId) };
    });
  }
}
