import { Module } from '@nestjs/common';
import { WorkoutPlanModule } from './plan/workout-plan.module';
import { WorkoutTrackingModule } from './tracking/workout-tracking.module';

@Module({
  imports: [WorkoutPlanModule, WorkoutTrackingModule],
  exports: [WorkoutPlanModule, WorkoutTrackingModule],
})
/** Composes and re-exports the independent workout capabilities. */
export class WorkoutModule {}
