import { Injectable } from '@nestjs/common';
import { ExercisesQueries } from './exercises.queries.ts';
import type { GetAllExercisesResponse } from '@strong-together/shared';

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesQueries: ExercisesQueries) {}

  async getAllExercisesData(): Promise<GetAllExercisesResponse> {
    return this.exercisesQueries.queryGetExerciseMapByMuscle();
  }
}
