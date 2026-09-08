import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { WorkoutScheduleController } from './workout-schedule.controller';
import { WorkoutScheduleQueries } from './workout-schedule.queries';
import { WorkoutScheduleService } from './workout-schedule.service';

@Module({
  imports: [AuthGuardsModule],
  controllers: [WorkoutScheduleController],
  providers: [WorkoutScheduleService, WorkoutScheduleQueries, DpopGuard, RlsTxInterceptor],
})
export class WorkoutScheduleModule {}
