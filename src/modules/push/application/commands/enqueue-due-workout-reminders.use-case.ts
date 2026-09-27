import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { PushBatchResult } from '../models/push.models';
import { PushQueries } from '../ports/push.queries';
import { WorkoutReminderQueue } from '../ports/workout-reminder-queue.port';
import { WorkoutReminderNotification } from '../../domain/entities/workout-reminder-notification';

/** Schedules push jobs for workout reminders due in the cron window. */
@Injectable()
export class EnqueueDueWorkoutRemindersUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: PushQueries,
    private readonly queue: WorkoutReminderQueue,
  ) {}

  /**
   * Finds due reminders and schedules their delayed push jobs after commit.
   *
   * @param requestId - Optional request correlation identifier.
   * @returns The number of reminders scheduled for delivery.
   */
  async execute(requestId?: string): Promise<PushBatchResult> {
    return this.unitOfWork.executeReadOnly(undefined, async () => {
      const reminders = await this.query.findDueWorkoutReminders();
      const now = Date.now();

      this.unitOfWork.afterCommit(() =>
        this.queue.enqueue(
          reminders.map((reminder) => new WorkoutReminderNotification(reminder, now, requestId)),
        ),
      );

      return {
        success: true,
        message: 'Workout reminders enqueued',
        reminderCount: reminders.length,
      };
    });
  }
}
