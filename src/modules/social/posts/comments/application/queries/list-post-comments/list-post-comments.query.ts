import { Query, type IQuery } from '@nestjs/cqrs';

import type { CommentsPage } from '../../models/comments.models';
export class ListPostCommentsQuery extends Query<CommentsPage> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly limit: number,
    public readonly cursor?: string,
  ) {
    super();
  }
}
