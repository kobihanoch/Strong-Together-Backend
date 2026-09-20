import { Injectable } from '@nestjs/common';
import type { ExerciseCatalogue } from '../models/exercises.models';
import { ExercisesRepository } from '../ports/exercises.repository';

/** Retrieves the exercise catalogue used by workout-building flows. */
@Injectable()
export class ListExercisesUseCase {
  constructor(private readonly repository: ExercisesRepository) {}

  /**
   * Retrieves the exercise catalogue grouped by target muscle.
   *
   * @returns The complete grouped exercise catalogue.
   */
  async execute(): Promise<ExerciseCatalogue> {
    return this.repository.findCatalogue();
  }
}
