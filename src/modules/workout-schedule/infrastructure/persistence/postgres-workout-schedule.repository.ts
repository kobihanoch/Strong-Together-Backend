import { Injectable } from '@nestjs/common';
import { ReplaceForUserSql } from './writes/replace-for-user.sql';
import type { ReplaceWorkoutSchedulesOutcome, WorkoutScheduleInput } from '../../application/models/workout-schedule.models';
import { WorkoutScheduleRepository } from '../../application/ports/workout-schedule.repository';

/** PostgreSQL implementation of workout-schedule persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutScheduleRepository implements WorkoutScheduleRepository {
  public constructor(private readonly replaceForUserSql: ReplaceForUserSql) {}
  public async replaceForUser(userId: string, schedules: WorkoutScheduleInput[]): Promise<ReplaceWorkoutSchedulesOutcome> {
    return (await this.replaceForUserSql.replaceForUser(userId, schedules)) ? { kind: 'replaced' } : { kind: 'invalid-splits' };
  }
}
