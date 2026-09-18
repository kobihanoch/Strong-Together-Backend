import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from './exercises.repository';
import type { ListExercisesResponse } from '@strong-together/shared';

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesRepository: ExercisesRepository) {}

  /**
   * Retrieves all exercises.
   * @returns The all exercises result.
   */
  async listExercisesData(): Promise<ListExercisesResponse> {
    return this.exercisesRepository.findExerciseMapByMuscle();
  }
}
