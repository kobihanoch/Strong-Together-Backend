import { Injectable } from '@nestjs/common';
import { FindPersonalRecordsSql } from './reads/find-personal-records.sql';
import { FindWorkoutStatisticsSql } from './reads/find-workout-statistics.sql';
import { FindExerciseHistorySql } from './reads/find-exercise-history.sql';
import { FindWorkoutHistorySql } from './reads/find-workout-history.sql';
import type { ExerciseHistory, PersonalRecords, WorkoutHistory, WorkoutStatistics } from '../../application/models/workout-tracking.models';
import { WorkoutTrackingQueries } from '../../application/ports/workout-tracking.queries';
/** PostgreSQL adapter for workout tracking. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresWorkoutTrackingQueries implements WorkoutTrackingQueries {
  public constructor(
    private readonly findWorkoutHistorySql: FindWorkoutHistorySql,
    private readonly findExerciseHistorySql: FindExerciseHistorySql,
    private readonly findWorkoutStatisticsSql: FindWorkoutStatisticsSql,
    private readonly findPersonalRecordsSql: FindPersonalRecordsSql,
  ) {}
  findWorkoutHistory(days: number, timezone: string): Promise<WorkoutHistory> {
    return this.findWorkoutHistorySql.findWorkoutHistory(days, timezone);
  }
  findExerciseHistory(days: number, timezone: string): Promise<ExerciseHistory> {
    return this.findExerciseHistorySql.findExerciseHistory(days, timezone);
  }
  findStatistics(days: number, timezone: string): Promise<WorkoutStatistics> {
    return this.findWorkoutStatisticsSql.findWorkoutStatistics(days, timezone);
  }
  findPersonalRecords(timezone: string): Promise<PersonalRecords> {
    return this.findPersonalRecordsSql.findPersonalRecords(timezone);
  }
}
