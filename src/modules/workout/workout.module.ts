import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { WorkoutPlanController } from './plan/plan.controller.ts';
import { WorkoutPlanQueries } from './plan/plan.queries.ts';
import { WorkoutPlanService } from './plan/plan.service.ts';
import { WorkoutTrackingController } from './tracking/tracking.controller.ts';
import { WorkoutTrackingQueries } from './tracking/tracking.queries.ts';
import { WorkoutTrackingService } from './tracking/tracking.service.ts';

@Module({
  imports: [AuthGuardsModule, MessagesModule],
  controllers: [WorkoutPlanController, WorkoutTrackingController],
  providers: [
    WorkoutPlanQueries,
    WorkoutPlanService,
    WorkoutTrackingQueries,
    WorkoutTrackingService,
    DpopGuard,
    RlsTxInterceptor,
  ],
  exports: [WorkoutPlanService, WorkoutTrackingService],
})
export class WorkoutModule {}
