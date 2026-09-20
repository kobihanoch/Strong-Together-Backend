import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { WorkoutPlanCache } from './application/ports/workout-plan-cache.port';
import { WorkoutPlanRepository } from './application/ports/workout-plan.repository';
import { GetWorkoutPlanUseCase } from './application/use-cases/get-workout-plan.use-case';
import { ReplaceWorkoutPlanUseCase } from './application/use-cases/replace-workout-plan.use-case';
import { PostgresWorkoutPlanRepository } from './infrastructure/postgres-workout-plan.repository';
import { RedisWorkoutPlanCache } from './infrastructure/redis-workout-plan.cache';
import { WorkoutPlanSql } from './infrastructure/workout-plan.sql';
import { WorkoutPlanController } from './presentation/workout-plan.controller';
/** Composes workout-plan management and its adapters. */
@Module({
  controllers: [WorkoutPlanController],
  providers: [
    WorkoutPlanSql,
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
