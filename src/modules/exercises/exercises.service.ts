import { Injectable } from '@nestjs/common';
import { ExercisesQueries } from './exercises.queries';
import type { ListExercisesResponse } from '@strong-together/shared';

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesQueries: ExercisesQueries) {}

  /**
   * Retrieves all exercises.
   * @returns The all exercises result.
   */
  async listExercisesData(): Promise<ListExercisesResponse> {
    return this.exercisesQueries.queryGetExerciseMapByMuscle();
  }
}
