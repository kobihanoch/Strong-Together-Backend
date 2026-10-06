import { Query, type IQuery } from '@nestjs/cqrs';

import type { SocialSummary } from '../../models/social-summary.models';
export class GetSocialSummaryQuery extends Query<SocialSummary> implements IQuery {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
