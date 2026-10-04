import { Query, type IQuery } from '@nestjs/cqrs';

import type { WorkoutSchedules } from '../../models/workout-schedule.models';
export class GetWorkoutSchedulesQuery extends Query<WorkoutSchedules> implements IQuery {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
