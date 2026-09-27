import { Injectable } from '@nestjs/common';
import { SaveSql } from './writes/save.sql';
import { WorkoutScheduleRepository } from '../../application/ports/workout-schedule.repository';
import type { WorkoutSchedule } from '../../domain/entities/workout-schedule';

/** PostgreSQL implementation of workout-schedule persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutScheduleRepository implements WorkoutScheduleRepository {
  public constructor(private readonly saveSql: SaveSql) {}
  public async save(userId: string, schedule: WorkoutSchedule): Promise<boolean> {
    const entries = schedule.entries.map((entry) => ({
      workoutSplitId: entry.workoutSplitId.value,
      dayOfWeek: entry.dayOfWeek.value,
      startTime: entry.startTime.value,
    }));
    return this.saveSql.save(userId, entries);
  }
}
