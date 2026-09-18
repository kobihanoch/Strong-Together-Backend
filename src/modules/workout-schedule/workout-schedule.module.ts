import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { PostgresWorkoutScheduleRepository } from './postgres-workout-schedule.repository';
import { WorkoutScheduleController } from './workout-schedule.controller';
import { WorkoutScheduleQueries } from './workout-schedule.queries';
import { WorkoutScheduleRepository } from './workout-schedule.repository';
import { WorkoutScheduleService } from './workout-schedule.service';

@Module({
  controllers: [WorkoutScheduleController],
  providers: [
    WorkoutScheduleService,
    WorkoutScheduleQueries,
    {
      provide: WorkoutScheduleRepository,
      useClass: PostgresWorkoutScheduleRepository,
    },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class WorkoutScheduleModule {}
