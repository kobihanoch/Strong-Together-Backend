import { Injectable } from '@nestjs/common';
import { ListForPostSql } from './reads/list-for-post.sql';
import type { PostReaction } from '../../application/models/reactions.models';
import { ReactionsQueries } from '../../application/ports/reactions.queries';
/** PostgreSQL implementation of reaction persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresReactionsQueries implements ReactionsQueries {
  public constructor(private readonly listForPostSql: ListForPostSql) {}
  public list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostReaction[]> {
    return this.listForPostSql.listForPost(postId, limit, cursor);
  }
}
