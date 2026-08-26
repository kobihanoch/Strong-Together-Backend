import { Injectable } from '@nestjs/common';
import { ExercisesQueries } from './exercises.queries';
import type { GetAllExercisesResponse } from '@strong-together/shared';

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesQueries: ExercisesQueries) {}

  /**
   * Retrieves all exercises.
   * @returns The all exercises result.
   */
  async getAllExercisesData(): Promise<GetAllExercisesResponse> {
    return this.exercisesQueries.queryGetExerciseMapByMuscle();
  }
}
