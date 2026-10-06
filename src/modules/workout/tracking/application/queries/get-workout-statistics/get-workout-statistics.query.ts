import { Query, type IQuery } from '@nestjs/cqrs';

import type { WorkoutStatistics } from '../../models/workout-tracking.models';
export class GetWorkoutStatisticsQuery extends Query<{ payload: WorkoutStatistics; cacheHit: boolean }> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly days = 45,
    public readonly fromCache = true,
    public readonly timezone: string,
  ) {
    super();
  }
}
