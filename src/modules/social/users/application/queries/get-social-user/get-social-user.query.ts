import { Query, type IQuery } from '@nestjs/cqrs';

import type { SocialUserProfile } from '../../models/social-users.models';
export class GetSocialUserQuery extends Query<SocialUserProfile> implements IQuery {
  public constructor(
    public readonly requestingUserId: string,
    public readonly targetUserId: string,
  ) {
    super();
  }
}
