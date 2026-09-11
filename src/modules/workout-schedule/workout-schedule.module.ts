import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { WorkoutScheduleController } from './workout-schedule.controller';
import { WorkoutScheduleQueries } from './workout-schedule.queries';
import { WorkoutScheduleService } from './workout-schedule.service';

@Module({
  controllers: [WorkoutScheduleController],
  providers: [WorkoutScheduleService, WorkoutScheduleQueries, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class WorkoutScheduleModule {}
