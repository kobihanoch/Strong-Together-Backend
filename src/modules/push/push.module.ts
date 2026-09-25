import { Module } from '@nestjs/common';
import { PushNotificationsModule } from '../../infrastructure/queues/push-notifications/push-notifications.module';
import { PushQueries } from './application/ports/push.queries';
import { WorkoutReminderQueue } from './application/ports/workout-reminder-queue.port';
import { EnqueueDueWorkoutRemindersUseCase } from './application/commands/enqueue-due-workout-reminders.use-case';
import { PostgresPushQueries } from './infrastructure/persistence/postgres-push.queries';
import { FindDueWorkoutRemindersSql } from './infrastructure/persistence/reads/find-due-workout-reminders.sql';
import { FindEligibleExpoPushTokenSql } from './infrastructure/persistence/reads/find-eligible-expo-push-token.sql';
import { BullWorkoutReminderQueue } from './infrastructure/bull-workout-reminder.queue';
import { PushController } from './presentation/push.controller';

@Module({
  imports: [PushNotificationsModule],
  controllers: [PushController],
  providers: [
    FindDueWorkoutRemindersSql,
    FindEligibleExpoPushTokenSql,
    {
      provide: PushQueries,
      useClass: PostgresPushQueries,
    },
    {
      provide: WorkoutReminderQueue,
      useClass: BullWorkoutReminderQueue,
    },
    EnqueueDueWorkoutRemindersUseCase,
  ],
})
export class PushModule {}
