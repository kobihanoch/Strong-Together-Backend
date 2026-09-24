import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { PushBatchResult } from '../models/push.models';
import { PushRepository } from '../ports/push.repository';
import { WorkoutReminderQueue } from '../ports/workout-reminder-queue.port';

/** Schedules push jobs for workout reminders due in the cron window. */
@Injectable()
export class EnqueueDueWorkoutRemindersUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PushRepository,
    private readonly queue: WorkoutReminderQueue,
  ) {}

  /**
   * Finds due reminders and schedules their delayed push jobs after commit.
   *
   * @param requestId - Optional request correlation identifier.
   * @returns The number of reminders scheduled for delivery.
   */
  async execute(requestId?: string): Promise<PushBatchResult> {
    return this.unitOfWork.execute(undefined, async () => {
      const reminders = await this.repository.findDueWorkoutReminders();
      const now = Date.now();

      this.unitOfWork.afterCommit(() =>
        this.queue.enqueue(
          reminders.map((reminder) => ({
            userId: reminder.userId,
            workoutScheduleId: reminder.workoutScheduleId,
            occurrenceDate: reminder.occurrenceDate,
            reminderAt: reminder.reminderAt.toISOString(),
            title: `Hello, ${reminder.firstName}!`,
            body: `Your ${reminder.splitName} workout starts soon.`,
            delay: Math.max(0, reminder.reminderAt.getTime() - now),
            expiresAt: 0,
            ...(requestId ? { requestId } : {}),
          })),
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
