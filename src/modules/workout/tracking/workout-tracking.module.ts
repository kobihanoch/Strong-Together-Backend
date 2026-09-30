import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { WorkoutTrackingCache } from './application/ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from './application/ports/workout-tracking.repository';
import { CreateWorkoutSessionHandler } from './application/commands/create-workout-session/create-workout-session.handler';
import { GetExerciseHistoryHandler } from './application/queries/get-exercise-history/get-exercise-history.handler';
import { GetPersonalRecordsHandler } from './application/queries/get-personal-records/get-personal-records.handler';
import { GetWorkoutHistoryHandler } from './application/queries/get-workout-history/get-workout-history.handler';
import { GetWorkoutStatisticsHandler } from './application/queries/get-workout-statistics/get-workout-statistics.handler';
import { PostgresWorkoutTrackingRepository } from './infrastructure/persistence/postgres-workout-tracking.repository';
import { RedisWorkoutTrackingCache } from './infrastructure/redis-workout-tracking.cache';
import { FindExerciseHistorySql } from './infrastructure/persistence/reads/find-exercise-history.sql';
import { FindPersonalRecordsSql } from './infrastructure/persistence/reads/find-personal-records.sql';
import { FindWorkoutHistorySql } from './infrastructure/persistence/reads/find-workout-history.sql';
import { FindWorkoutStatisticsSql } from './infrastructure/persistence/reads/find-workout-statistics.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { WorkoutTrackingController } from './presentation/workout-tracking.controller';
import { WorkoutTrackingQueries } from './application/ports/workout-tracking.queries';
import { PostgresWorkoutTrackingQueries } from './infrastructure/persistence/postgres-workout-tracking.queries';
/** Composes workout tracking and its adapters. */
@Module({
  controllers: [WorkoutTrackingController],
  providers: [
    { provide: WorkoutTrackingQueries, useClass: PostgresWorkoutTrackingQueries },
    FindExerciseHistorySql,
    FindPersonalRecordsSql,
    FindWorkoutHistorySql,
    FindWorkoutStatisticsSql,
    CreateSql,
    { provide: WorkoutTrackingRepository, useClass: PostgresWorkoutTrackingRepository },
    { provide: WorkoutTrackingCache, useClass: RedisWorkoutTrackingCache },
    GetWorkoutHistoryHandler,
    GetExerciseHistoryHandler,
    GetWorkoutStatisticsHandler,
    GetPersonalRecordsHandler,
    CreateWorkoutSessionHandler,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class WorkoutTrackingModule {}
