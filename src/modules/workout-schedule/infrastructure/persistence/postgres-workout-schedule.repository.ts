import { Injectable } from '@nestjs/common';
import { ReplaceForUserSql } from './writes/replace-for-user.sql';
import type { ReplaceWorkoutSchedulesOutcome } from '../../application/models/workout-schedule.models';
import { WorkoutScheduleRepository } from '../../application/ports/workout-schedule.repository';
import type { WeeklyWorkoutSchedule } from '../../domain/entities/weekly-workout-schedule';

/** PostgreSQL implementation of workout-schedule persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutScheduleRepository implements WorkoutScheduleRepository {
  public constructor(private readonly replaceForUserSql: ReplaceForUserSql) {}
  public async replaceForUser(userId: string, schedule: WeeklyWorkoutSchedule): Promise<ReplaceWorkoutSchedulesOutcome> {
    const entries = schedule.entries.map((entry) => ({
      workoutSplitId: entry.workoutSplitId.value,
      dayOfWeek: entry.dayOfWeek.value,
      startTime: entry.startTime.value,
    }));
    return this.replaceForUserSql.replaceForUser(userId, entries);
  }
}
