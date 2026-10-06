import { Injectable } from '@nestjs/common';
import { ListForPostSql } from './reads/list-for-post.sql';
import type { PostComment } from '../../application/models/comments.models';
import { CommentsQueries } from '../../application/ports/comments.queries';
/** PostgreSQL implementation of comment persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresCommentsQueries implements CommentsQueries {
  public constructor(private readonly listForPostSql: ListForPostSql) {}
  public list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostComment[]> {
    return this.listForPostSql.listForPost(postId, limit, cursor);
  }
}
