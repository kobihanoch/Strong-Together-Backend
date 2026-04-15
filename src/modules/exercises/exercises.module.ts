import { Module } from '@nestjs/common';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ExercisesController } from './exercises.controller.ts';
import { ExercisesService } from './exercises.service.ts';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class ExercisesModule {}
