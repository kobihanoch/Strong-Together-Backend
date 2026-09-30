import { Query, type IQuery } from '@nestjs/cqrs';

import type { WorkoutPlanResult } from '../../models/workout-plan.models';
export class GetWorkoutPlanQuery extends Query<{ payload: WorkoutPlanResult; cacheHit: boolean }> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly fromCache = true,
    public readonly timezone = 'Asia/Jerusalem',
  ) {
    super();
  }
}
