import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { WorkoutTrackingCache } from './application/ports/workout-tracking-cache.port';
import { WorkoutTrackingRepository } from './application/ports/workout-tracking.repository';
import { CreateWorkoutSessionUseCase } from './application/use-cases/create-workout-session.use-case';
import { GetExerciseHistoryUseCase } from './application/use-cases/get-exercise-history.use-case';
import { GetPersonalRecordsUseCase } from './application/use-cases/get-personal-records.use-case';
import { GetWorkoutHistoryUseCase } from './application/use-cases/get-workout-history.use-case';
import { GetWorkoutStatisticsUseCase } from './application/use-cases/get-workout-statistics.use-case';
import { PostgresWorkoutTrackingRepository } from './infrastructure/postgres-workout-tracking.repository';
import { RedisWorkoutTrackingCache } from './infrastructure/redis-workout-tracking.cache';
import { WorkoutTrackingSql } from './infrastructure/workout-tracking.sql';
import { WorkoutTrackingController } from './presentation/workout-tracking.controller';
/** Composes workout tracking and its adapters. */ @Module({
  controllers: [WorkoutTrackingController],
  providers: [
    WorkoutTrackingSql,
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
