import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { WorkoutTrackingCache } from './application/ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from './application/ports/workout-tracking.repository';
import { CreateWorkoutSessionUseCase } from './application/commands/create-workout-session.use-case';
import { GetExerciseHistoryUseCase } from './application/queries/get-exercise-history.use-case';
import { GetPersonalRecordsUseCase } from './application/queries/get-personal-records.use-case';
import { GetWorkoutHistoryUseCase } from './application/queries/get-workout-history.use-case';
import { GetWorkoutStatisticsUseCase } from './application/queries/get-workout-statistics.use-case';
import { PostgresWorkoutTrackingRepository } from './infrastructure/persistence/postgres-workout-tracking.repository';
import { RedisWorkoutTrackingCache } from './infrastructure/redis-workout-tracking.cache';
import { FindExerciseHistorySql } from './infrastructure/persistence/reads/find-exercise-history.sql';
import { FindPersonalRecordsSql } from './infrastructure/persistence/reads/find-personal-records.sql';
import { FindWorkoutHistorySql } from './infrastructure/persistence/reads/find-workout-history.sql';
import { FindWorkoutStatisticsSql } from './infrastructure/persistence/reads/find-workout-statistics.sql';
import { CreateWorkoutSessionSql } from './infrastructure/persistence/writes/create-workout-session.sql';
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
    CreateWorkoutSessionSql,
    { provide: WorkoutTrackingRepository, useClass: PostgresWorkoutTrackingRepository },
    { provide: WorkoutTrackingCache, useClass: RedisWorkoutTrackingCache },
    GetWorkoutHistoryUseCase,
    GetExerciseHistoryUseCase,
    GetWorkoutStatisticsUseCase,
    GetPersonalRecordsUseCase,
    CreateWorkoutSessionUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class WorkoutTrackingModule {}
