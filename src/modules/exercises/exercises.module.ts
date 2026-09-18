import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { ExercisesController } from './exercises.controller';
import { ExercisesQueries } from './exercises.queries';
import { ExercisesService } from './exercises.service';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesQueries, ExercisesService, DpopGuard, AuthenticationGuard, AuthorizationGuard],
})
export class ExercisesModule {}
