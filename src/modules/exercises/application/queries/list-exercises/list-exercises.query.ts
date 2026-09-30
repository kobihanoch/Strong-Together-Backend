import { Query, type IQuery } from '@nestjs/cqrs';

import type { ExerciseCatalogue } from '../../models/exercises.models';
export class ListExercisesQuery extends Query<ExerciseCatalogue> implements IQuery {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
