import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { WorkoutPlanCache } from './application/ports/workout-plan-cache.port';
import { WorkoutPlanRepository } from './application/ports/workout-plan.repository';
import { GetWorkoutPlanUseCase } from './application/queries/get-workout-plan.use-case';
import { ReplaceWorkoutPlanUseCase } from './application/commands/replace-workout-plan.use-case';
import { PostgresWorkoutPlanRepository } from './infrastructure/persistence/postgres-workout-plan.repository';
import { RedisWorkoutPlanCache } from './infrastructure/redis-workout-plan.cache';
import { FindActiveByUserSql } from './infrastructure/persistence/reads/find-active-by-user.sql';
import { ReplaceForUserSql } from './infrastructure/persistence/writes/replace-for-user.sql';
import { WorkoutPlanController } from './presentation/workout-plan.controller';
import { WorkoutPlanQueries } from './application/ports/workout-plan.queries';
import { PostgresWorkoutPlanQueries } from './infrastructure/persistence/postgres-workout-plan.queries';
/** Composes workout-plan management and its adapters. */
@Module({
  controllers: [WorkoutPlanController],
  providers: [
    { provide: WorkoutPlanQueries, useClass: PostgresWorkoutPlanQueries },
    FindActiveByUserSql,
    ReplaceForUserSql,
    { provide: WorkoutPlanRepository, useClass: PostgresWorkoutPlanRepository },
    { provide: WorkoutPlanCache, useClass: RedisWorkoutPlanCache },
    GetWorkoutPlanUseCase,
    ReplaceWorkoutPlanUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class WorkoutPlanModule {}
