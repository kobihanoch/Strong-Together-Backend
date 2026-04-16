import { Module } from '@nestjs/common';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ExercisesController } from './exercises.controller.ts';
import { ExercisesQueries } from './exercises.queries.ts';
import { ExercisesService } from './exercises.service.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesQueries, ExercisesService, SessionQueries, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class ExercisesModule {}
