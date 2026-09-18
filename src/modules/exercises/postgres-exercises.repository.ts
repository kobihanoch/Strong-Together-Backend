import { Injectable } from '@nestjs/common';
import type { ExercisesMapByMuscleQueryDto } from '@strong-together/shared';
import { ExercisesQueries } from './exercises.queries';
import { ExercisesRepository } from './exercises.repository';

@Injectable()
export class PostgresExercisesRepository implements ExercisesRepository {
  constructor(private readonly queries: ExercisesQueries) {}

  findExerciseMapByMuscle(): Promise<ExercisesMapByMuscleQueryDto> {
    return this.queries.queryGetExerciseMapByMuscle();
  }
}
