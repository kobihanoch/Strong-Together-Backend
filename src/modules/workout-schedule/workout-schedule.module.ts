import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WorkoutScheduleCache } from './application/ports/workout-schedule-cache.port';
import { WorkoutScheduleRepository } from './application/ports/workout-schedule.repository';
import { GetWorkoutSchedulesUseCase } from './application/use-cases/get-workout-schedules.use-case';
import { ReplaceWorkoutSchedulesUseCase } from './application/use-cases/replace-workout-schedules.use-case';
import { PostgresWorkoutScheduleRepository } from './infrastructure/postgres-workout-schedule.repository';
import { RedisWorkoutScheduleCache } from './infrastructure/redis-workout-schedule.cache';
import { WorkoutScheduleSql } from './infrastructure/workout-schedule.sql';
import { WorkoutScheduleController } from './presentation/workout-schedule.controller';

@Module({
  controllers: [WorkoutScheduleController],
  providers: [
    GetWorkoutSchedulesUseCase,
    ReplaceWorkoutSchedulesUseCase,
    WorkoutScheduleSql,
    {
      provide: WorkoutScheduleRepository,
      useClass: PostgresWorkoutScheduleRepository,
    },
    {
      provide: WorkoutScheduleCache,
      useClass: RedisWorkoutScheduleCache,
    },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
/** Composes workout-schedule application, persistence, cache, and presentation dependencies. */
export class WorkoutScheduleModule {}
