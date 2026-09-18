import { Injectable } from '@nestjs/common';
import type { DueWorkoutReminder } from './push.dtos';
import { PushQueries } from './push.queries';
import { PushRepository } from './push.repository';

@Injectable()
export class PostgresPushRepository implements PushRepository {
  constructor(private readonly queries: PushQueries) {}

  findDueWorkoutReminders(): Promise<DueWorkoutReminder[]> {
    return this.queries.queryDueWorkoutReminders();
  }

  findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null> {
    return this.queries.queryExpoPushToken(userId, workoutScheduleId, occurrenceDate);
  }
}
