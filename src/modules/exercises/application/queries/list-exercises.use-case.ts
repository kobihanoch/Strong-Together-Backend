import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { ExerciseCatalogue } from '../models/exercises.models';
import { ExercisesQueries } from '../ports/exercises.queries';

/** Retrieves the exercise catalogue used by workout-building flows. */
@Injectable()
export class ListExercisesUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: ExercisesQueries,
  ) {}

  /**
   * Retrieves the exercise catalogue grouped by target muscle.
   *
   * @returns The complete grouped exercise catalogue.
   */
  async execute(userId: string): Promise<ExerciseCatalogue> {
    return this.unitOfWork.executeReadOnly(userId, async () => {
      return this.query.findCatalogue();
    });
  }
}
