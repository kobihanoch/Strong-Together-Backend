import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { ExercisesQueries } from './application/ports/exercises.queries';
import { ListExercisesUseCase } from './application/queries/list-exercises.use-case';
import { FindCatalogueSql } from './infrastructure/persistence/reads/find-catalogue.sql';
import { PostgresExercisesQueries } from './infrastructure/persistence/postgres-exercises.queries';
import { ExercisesController } from './presentation/exercises.controller';

/** Composes the exercise catalogue application and its adapters. */
@Module({
  controllers: [ExercisesController],
  providers: [
    FindCatalogueSql,
    {
      provide: ExercisesQueries,
      useClass: PostgresExercisesQueries,
    },
    ListExercisesUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class ExercisesModule {}
