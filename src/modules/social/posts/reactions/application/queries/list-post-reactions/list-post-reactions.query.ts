import { Query, type IQuery } from '@nestjs/cqrs';

import type { ReactionsPage } from '../../models/reactions.models';
export class ListPostReactionsQuery extends Query<ReactionsPage> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly limit: number,
    public readonly cursor?: string,
  ) {
    super();
  }
}
