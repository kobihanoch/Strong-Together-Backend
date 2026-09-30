import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { PushBatchResult } from '../../models/push.models';
import { PushQueries } from '../../ports/push.queries';
import { WorkoutReminderQueue } from '../../ports/workout-reminder-queue.port';
import { WorkoutReminderNotification } from '../../../domain/entities/workout-reminder-notification';
import { EnqueueDueWorkoutRemindersCommand } from './enqueue-due-workout-reminders.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Schedules push jobs for workout reminders due in the cron window. */
@CommandHandler(EnqueueDueWorkoutRemindersCommand)
export class EnqueueDueWorkoutRemindersHandler implements ICommandHandler<EnqueueDueWorkoutRemindersCommand> {
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
  async execute(command: EnqueueDueWorkoutRemindersCommand): Promise<PushBatchResult> {
    const { requestId } = command;
    return this.unitOfWork.executeReadOnly(undefined, async () => {
      const reminders = await this.query.findDueWorkoutReminders();
      const now = Date.now();

      this.unitOfWork.afterCommit(() =>
        this.queue.enqueue(
          reminders.map((reminder) => WorkoutReminderNotification.create(reminder, now, requestId)),
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
