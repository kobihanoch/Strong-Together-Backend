import { Query, type IQuery } from '@nestjs/cqrs';

import type { WorkoutHistory } from '../../models/workout-tracking.models';
export class GetWorkoutHistoryQuery extends Query<{ payload: WorkoutHistory; cacheHit: boolean }> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly days = 45,
    public readonly fromCache = true,
    public readonly timezone: string,
  ) {
    super();
  }
}
