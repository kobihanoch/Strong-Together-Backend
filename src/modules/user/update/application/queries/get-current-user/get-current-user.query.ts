import { Query, type IQuery } from '@nestjs/cqrs';

import type { UserProfile } from '../../models/update-user.models';
export class GetCurrentUserQuery extends Query<UserProfile> implements IQuery {
  public constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
