import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WorkoutScheduleCache } from './application/ports/workout-schedule-cache.port';
import { WorkoutScheduleRepository } from './application/ports/workout-schedule.repository';
import { GetWorkoutSchedulesUseCase } from './application/queries/get-workout-schedules.use-case';
import { ReplaceWorkoutSchedulesUseCase } from './application/commands/replace-workout-schedules.use-case';
import { PostgresWorkoutScheduleRepository } from './infrastructure/persistence/postgres-workout-schedule.repository';
import { RedisWorkoutScheduleCache } from './infrastructure/redis-workout-schedule.cache';
import { FindByUserSql } from './infrastructure/persistence/reads/find-by-user.sql';
import { ReplaceForUserSql } from './infrastructure/persistence/writes/replace-for-user.sql';
import { WorkoutScheduleController } from './presentation/workout-schedule.controller';
import { WorkoutScheduleQueries } from './application/ports/workout-schedule.queries';
import { PostgresWorkoutScheduleQueries } from './infrastructure/persistence/postgres-workout-schedule.queries';

@Module({
  controllers: [WorkoutScheduleController],
  providers: [
    { provide: WorkoutScheduleQueries, useClass: PostgresWorkoutScheduleQueries },
    GetWorkoutSchedulesUseCase,
    ReplaceWorkoutSchedulesUseCase,
    FindByUserSql,
    ReplaceForUserSql,
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
