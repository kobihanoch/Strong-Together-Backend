import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { ExercisesRepository } from './application/ports/exercises.repository';
import { ListExercisesUseCase } from './application/use-cases/list-exercises.use-case';
import { ExercisesSql } from './infrastructure/exercises.sql';
import { PostgresExercisesRepository } from './infrastructure/postgres-exercises.repository';
import { ExercisesController } from './presentation/exercises.controller';

/** Composes the exercise catalogue application and its adapters. */
@Module({
  controllers: [ExercisesController],
  providers: [
    ExercisesSql,
    {
      provide: ExercisesRepository,
      useClass: PostgresExercisesRepository,
    },
    ListExercisesUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class ExercisesModule {}
