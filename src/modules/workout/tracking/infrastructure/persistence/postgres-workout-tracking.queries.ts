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
  findWorkoutHistory(u: string, d: number, t: string): Promise<WorkoutHistory> {
    return this.findWorkoutHistorySql.findWorkoutHistory(u, d, t);
  }
  findExerciseHistory(u: string, d: number, t: string): Promise<ExerciseHistory> {
    return this.findExerciseHistorySql.findExerciseHistory(u, d, t);
  }
  findStatistics(u: string, d: number, t: string): Promise<WorkoutStatistics> {
    return this.findWorkoutStatisticsSql.findWorkoutStatistics(u, d, t);
  }
  findPersonalRecords(u: string, t: string): Promise<PersonalRecords> {
    return this.findPersonalRecordsSql.findPersonalRecords(u, t);
  }
}
