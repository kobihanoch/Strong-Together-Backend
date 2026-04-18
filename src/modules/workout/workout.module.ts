import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { MessagesModule } from '../messages/messages.module';
import { WorkoutPlanController } from './plan/plan.controller';
import { WorkoutPlanQueries } from './plan/plan.queries';
import { WorkoutPlanService } from './plan/plan.service';
import { WorkoutTrackingController } from './tracking/tracking.controller';
import { WorkoutTrackingQueries } from './tracking/tracking.queries';
import { WorkoutTrackingService } from './tracking/tracking.service';

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
