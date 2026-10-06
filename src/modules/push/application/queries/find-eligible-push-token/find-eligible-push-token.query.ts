import { Query, type IQuery } from '@nestjs/cqrs';
export class FindEligiblePushTokenQuery extends Query<string | undefined> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly workoutScheduleId: string,
    public readonly occurrenceDate: string,
  ) {
    super();
  }
}
