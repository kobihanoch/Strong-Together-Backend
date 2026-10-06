import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { ExerciseCatalogue } from '../../models/exercises.models';
import { ExercisesQueries } from '../../ports/exercises.queries';
import { ListExercisesQuery } from './list-exercises.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves the exercise catalogue used by workout-building flows. */
@QueryHandler(ListExercisesQuery)
export class ListExercisesHandler implements IQueryHandler<ListExercisesQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: ExercisesQueries,
  ) {}

  /**
   * Retrieves the exercise catalogue grouped by target muscle.
   *
   * @returns The complete grouped exercise catalogue.
   */
  async execute(query: ListExercisesQuery): Promise<ExerciseCatalogue> {
    const { userId } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      return this.query.findCatalogue();
    });
  }
}
