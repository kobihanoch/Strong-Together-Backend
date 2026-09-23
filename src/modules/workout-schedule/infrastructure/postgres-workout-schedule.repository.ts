import { Injectable } from '@nestjs/common';
import type { ReplaceWorkoutSchedulesOutcome, WorkoutSchedule, WorkoutScheduleInput } from '../application/models/workout-schedule.models';
import { WorkoutScheduleRepository } from '../application/ports/workout-schedule.repository';
import { WorkoutScheduleSql } from './workout-schedule.sql';

/** PostgreSQL implementation of workout-schedule persistence. */
@Injectable()
export class PostgresWorkoutScheduleRepository implements WorkoutScheduleRepository {
  public constructor(private readonly sql: WorkoutScheduleSql) {}

  public findByUser(userId: string): Promise<WorkoutSchedule[]> {
    return this.sql.findByUser(userId);
  }

  public async replaceForUser(userId: string, schedules: WorkoutScheduleInput[]): Promise<ReplaceWorkoutSchedulesOutcome> {
    return (await this.sql.replaceForUser(userId, schedules)) ? { kind: 'replaced' } : { kind: 'invalid-splits' };
  }
}
