import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { PushQueries } from '../../ports/push.queries';
import { FindEligiblePushTokenQuery } from './find-eligible-push-token.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Rechecks whether a delayed workout notification is still eligible for delivery. */
@QueryHandler(FindEligiblePushTokenQuery)
export class FindEligiblePushTokenHandler implements IQueryHandler<FindEligiblePushTokenQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: PushQueries,
  ) {}

  /** Retrieves an eligible token inside the target user's RLS transaction. */
  execute(query: FindEligiblePushTokenQuery): Promise<string | undefined> {
    const { userId, workoutScheduleId, occurrenceDate } = query;
    return this.unitOfWork.executeReadOnly(userId, () => this.query.findEligibleExpoPushToken(userId, workoutScheduleId, occurrenceDate));
  }
}
