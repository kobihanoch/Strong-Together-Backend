import { Query, type IQuery } from '@nestjs/cqrs';

import type { SocialUsersSearchResult } from '../../models/social-users.models';
export class SearchSocialUsersQuery extends Query<SocialUsersSearchResult> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly search: string,
    public readonly limit: number,
    public readonly cursor?: string,
  ) {
    super();
  }
}
