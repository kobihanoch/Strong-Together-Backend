import { Injectable } from '@nestjs/common';
import { FindByUserSql } from './reads/find-by-user.sql';
import type { WorkoutSchedule } from '../../application/models/workout-schedule.models';
import { WorkoutScheduleQueries } from '../../application/ports/workout-schedule.queries';

/** PostgreSQL implementation of workout-schedule persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresWorkoutScheduleQueries implements WorkoutScheduleQueries {
  public constructor(private readonly findByUserSql: FindByUserSql) {}
  public findByUser(userId: string): Promise<WorkoutSchedule[]> {
    return this.findByUserSql.findByUser(userId);
  }
}
