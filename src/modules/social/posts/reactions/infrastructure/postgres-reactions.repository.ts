import { Injectable } from '@nestjs/common';
import type { DeleteReactionOutcome, PostReaction, SaveReactionOutcome } from '../application/models/reactions.models';
import { ReactionsRepository } from '../application/ports/reactions.repository';
import { ReactionsSql } from './reactions.sql';
/** PostgreSQL implementation of reaction persistence. */ @Injectable()
export class PostgresReactionsRepository implements ReactionsRepository {
  public constructor(private readonly sql: ReactionsSql) {}
  public list(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostReaction[]> {
    return this.sql.queryPostReactions(postId, limit, cursor);
  }
  public async save(postId: string, userId: string, type: PostReaction['type']): Promise<SaveReactionOutcome> {
    return (await this.sql.queryReact(postId, userId, type)).length > 0 ? { kind: 'saved' } : { kind: 'post-not-found' };
  }
  public async delete(postId: string, userId: string): Promise<DeleteReactionOutcome> {
    return (await this.sql.queryDeleteReaction(postId, userId)).length > 0 ? { kind: 'deleted' } : { kind: 'not-found' };
  }
}
