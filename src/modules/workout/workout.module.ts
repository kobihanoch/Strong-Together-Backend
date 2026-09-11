import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { WorkoutPlanController } from './plan/plan.controller';
import { WorkoutPlanQueries } from './plan/plan.queries';
import { WorkoutPlanService } from './plan/plan.service';
import { WorkoutTrackingController } from './tracking/tracking.controller';
import { WorkoutTrackingQueries } from './tracking/tracking.queries';
import { WorkoutTrackingService } from './tracking/tracking.service';

@Module({
  controllers: [WorkoutPlanController, WorkoutTrackingController],
  providers: [
    WorkoutPlanQueries,
    WorkoutPlanService,
    WorkoutTrackingQueries,
    WorkoutTrackingService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [WorkoutPlanService, WorkoutTrackingService],
})
export class WorkoutModule {}
