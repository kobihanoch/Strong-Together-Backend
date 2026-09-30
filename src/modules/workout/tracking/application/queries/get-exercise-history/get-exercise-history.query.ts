import { Query, type IQuery } from '@nestjs/cqrs';

import type { ExerciseHistory } from '../../models/workout-tracking.models';
export class GetExerciseHistoryQuery extends Query<{ payload: ExerciseHistory; cacheHit: boolean }> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly days = 45,
    public readonly fromCache = true,
    public readonly timezone: string,
  ) {
    super();
  }
}
