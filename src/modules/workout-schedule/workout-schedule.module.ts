import { Module } from '@nestjs/common';
import { WorkoutScheduleController } from './workout-schedule.controller';
import { WorkoutScheduleQueries } from './workout-schedule.queries';
import { WorkoutScheduleService } from './workout-schedule.service';

@Module({
  controllers: [WorkoutScheduleController],
  providers: [WorkoutScheduleService, WorkoutScheduleQueries],
})
export class WorkoutScheduleModule {}
