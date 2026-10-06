import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WorkoutScheduleCache } from './application/ports/workout-schedule-cache.port';
import { WorkoutScheduleRepository } from './application/ports/workout-schedule.repository';
import { GetWorkoutSchedulesHandler } from './application/queries/get-workout-schedules/get-workout-schedules.handler';
import { ReplaceWorkoutSchedulesHandler } from './application/commands/replace-workout-schedules/replace-workout-schedules.handler';
import { PostgresWorkoutScheduleRepository } from './infrastructure/persistence/postgres-workout-schedule.repository';
import { RedisWorkoutScheduleCache } from './infrastructure/redis-workout-schedule.cache';
import { FindByUserSql } from './infrastructure/persistence/reads/find-by-user.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { WorkoutScheduleController } from './presentation/workout-schedule.controller';
import { WorkoutScheduleQueries } from './application/ports/workout-schedule.queries';
import { PostgresWorkoutScheduleQueries } from './infrastructure/persistence/postgres-workout-schedule.queries';

@Module({
  controllers: [WorkoutScheduleController],
  providers: [
    { provide: WorkoutScheduleQueries, useClass: PostgresWorkoutScheduleQueries },
    GetWorkoutSchedulesHandler,
    ReplaceWorkoutSchedulesHandler,
    FindByUserSql,
    SaveSql,
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
