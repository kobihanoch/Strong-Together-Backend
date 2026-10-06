import { Query, type IQuery } from '@nestjs/cqrs';

import type { PostsPage } from '../../models/posts.models';
export class ListVisiblePostsQuery extends Query<PostsPage> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly limit: number,
    public readonly cursor?: string,
  ) {
    super();
  }
}
