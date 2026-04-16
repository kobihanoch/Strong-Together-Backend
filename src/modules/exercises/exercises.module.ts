import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ExercisesController } from './exercises.controller.ts';
import { ExercisesQueries } from './exercises.queries.ts';
import { ExercisesService } from './exercises.service.ts';

@Module({
  imports: [AuthGuardsModule],
  controllers: [ExercisesController],
  providers: [ExercisesQueries, ExercisesService, DpopGuard, RlsTxInterceptor],
})
export class ExercisesModule {}
