import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ExercisesController } from './exercises.controller';
import { ExercisesQueries } from './exercises.queries';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [AuthGuardsModule],
  controllers: [ExercisesController],
  providers: [ExercisesQueries, ExercisesService, DpopGuard, RlsTxInterceptor],
})
export class ExercisesModule {}
