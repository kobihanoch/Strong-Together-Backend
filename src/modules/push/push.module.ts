import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../infrastructure/queues/push-notifications/push-notifications.module';
import { PushRepository } from './application/ports/push.repository';
import { WorkoutReminderQueue } from './application/ports/workout-reminder-queue.port';
import { EnqueueDueWorkoutRemindersUseCase } from './application/use-cases/enqueue-due-workout-reminders.use-case';
import { PostgresPushRepository } from './infrastructure/postgres-push.repository';
import { PushSql } from './infrastructure/push.sql';
import { BullWorkoutReminderQueue } from './infrastructure/bull-workout-reminder.queue';
import { PushController } from './presentation/push.controller';

@Module({
  imports: [PushNotificationsModule],
  controllers: [PushController],
  providers: [
    PushSql,
    {
      provide: PushRepository,
      useClass: PostgresPushRepository,
    },
    {
      provide: WorkoutReminderQueue,
      useClass: BullWorkoutReminderQueue,
    },
    EnqueueDueWorkoutRemindersUseCase,
  ],
})
export class PushModule {}
