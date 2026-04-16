import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { WorkoutPlanController } from './plan/plan.controller.ts';
import { WorkoutPlanQueries } from './plan/plan.queries.ts';
import { WorkoutPlanService } from './plan/plan.service.ts';
import { WorkoutTrackingController } from './tracking/tracking.controller.ts';
import { WorkoutTrackingQueries } from './tracking/tracking.queries.ts';
import { WorkoutTrackingService } from './tracking/tracking.service.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';

@Module({
  imports: [MessagesModule],
  controllers: [WorkoutPlanController, WorkoutTrackingController],
  providers: [
    WorkoutPlanQueries,
    WorkoutPlanService,
    WorkoutTrackingQueries,
    WorkoutTrackingService,
    SessionQueries,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [WorkoutPlanService, WorkoutTrackingService],
})
export class WorkoutModule {}
