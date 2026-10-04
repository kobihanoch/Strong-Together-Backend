import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { SocialSummary } from '../../models/social-summary.models';
import { SocialSummaryQueries } from '../../ports/social-summary.queries';
import { GetSocialSummaryQuery } from './get-social-summary.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves the authenticated user's compact social overview. */
@QueryHandler(GetSocialSummaryQuery)
export class GetSocialSummaryHandler implements IQueryHandler<GetSocialSummaryQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: SocialSummaryQueries,
  ) {}

  /**
   * Retrieves the active crew count and unique participant previews.
   *
   * @returns The current user's social summary.
   */
  public execute(query: GetSocialSummaryQuery): Promise<SocialSummary> {
    const { userId } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      return this.query.get();
    });
  }
}
