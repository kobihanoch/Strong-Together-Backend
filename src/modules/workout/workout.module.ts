import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WorkoutPlanController } from './plan/plan.controller';
import { PostgresWorkoutPlanRepository } from './plan/postgres-plan.repository';
import { WorkoutPlanQueries } from './plan/plan.queries';
import { WorkoutPlanRepository } from './plan/plan.repository';
import { WorkoutPlanService } from './plan/plan.service';
import { WorkoutTrackingController } from './tracking/tracking.controller';
import { WorkoutTrackingQueries } from './tracking/tracking.queries';
import { WorkoutTrackingService } from './tracking/tracking.service';

@Module({
  controllers: [WorkoutPlanController, WorkoutTrackingController],
  providers: [
    WorkoutPlanQueries,
    {
      provide: WorkoutPlanRepository,
      useClass: PostgresWorkoutPlanRepository,
    },
    WorkoutPlanService,
    WorkoutTrackingQueries,
    WorkoutTrackingService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
  exports: [WorkoutPlanService, WorkoutTrackingService],
})
export class WorkoutModule {}
