import { Injectable } from '@nestjs/common';
import type { DueWorkoutReminder } from '../application/models/push.models';
import { PushRepository } from '../application/ports/push.repository';
import { PushSql } from './push.sql';

@Injectable()
export class PostgresPushRepository implements PushRepository {
  constructor(private readonly sql: PushSql) {}

  findDueWorkoutReminders(): Promise<DueWorkoutReminder[]> {
    return this.sql.findDueWorkoutReminders();
  }

  findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null> {
    return this.sql.findEligibleExpoPushToken(userId, workoutScheduleId, occurrenceDate);
  }
}
