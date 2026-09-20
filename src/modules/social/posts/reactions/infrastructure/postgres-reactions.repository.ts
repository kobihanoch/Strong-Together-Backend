import { Injectable } from '@nestjs/common';
import type { PostReaction } from '../application/models/reactions.models';
import { ReactionsRepository } from '../application/ports/reactions.repository';
import { ReactionsSql } from './reactions.sql';
/** PostgreSQL implementation of reaction persistence. */ @Injectable()
export class PostgresReactionsRepository implements ReactionsRepository {
  public constructor(private readonly sql: ReactionsSql) {}
  public list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostReaction[]> {
    return this.sql.queryPostReactions(postId, limit, cursor);
  }
  public async save(postId: string, userId: string, type: PostReaction['type']): Promise<boolean> {
    return (await this.sql.queryReact(postId, userId, type)).length > 0;
  }
  public async delete(postId: string, userId: string): Promise<boolean> {
    return (await this.sql.queryDeleteReaction(postId, userId)).length > 0;
  }
}
