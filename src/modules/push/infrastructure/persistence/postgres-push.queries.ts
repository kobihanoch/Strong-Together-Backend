import { Injectable } from '@nestjs/common';
import { FindEligibleExpoPushTokenSql } from './reads/find-eligible-expo-push-token.sql';
import { FindDueWorkoutRemindersSql } from './reads/find-due-workout-reminders.sql';
import type { DueWorkoutReminder } from '../../application/models/push.models';
import { PushQueries } from '../../application/ports/push.queries';

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresPushQueries implements PushQueries {
  public constructor(
    private readonly findDueWorkoutRemindersSql: FindDueWorkoutRemindersSql,
    private readonly findEligibleExpoPushTokenSql: FindEligibleExpoPushTokenSql,
  ) {}
  findDueWorkoutReminders(): Promise<DueWorkoutReminder[]> {
    return this.findDueWorkoutRemindersSql.findDueWorkoutReminders();
  }
  findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null> {
    return this.findEligibleExpoPushTokenSql.findEligibleExpoPushToken(userId, workoutScheduleId, occurrenceDate);
  }
}
