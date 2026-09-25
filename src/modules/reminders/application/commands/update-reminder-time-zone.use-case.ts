import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { UpdateReminderTimeZoneInput } from '../models/reminders.models';
import { RemindersRepository } from '../ports/reminders.repository';

/** Updates the time zone without changing whether reminders are enabled. */
@Injectable()
export class UpdateReminderTimeZoneUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: RemindersRepository,
  ) {}

  /**
   * Updates only a user's reminder time zone.
   *
   * @param userId - The settings owner.
   * @param settings - The new time zone.
   * @returns Nothing.
   */
  async execute(userId: string, settings: UpdateReminderTimeZoneInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.updateTimeZoneForUser(userId, settings);
    });
  }
}
