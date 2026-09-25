import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import type { DeleteReactionOutcome, PostReaction, SaveReactionOutcome } from '../../application/models/reactions.models';
import { ReactionsRepository } from '../../application/ports/reactions.repository';
/** PostgreSQL implementation of reaction persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresReactionsRepository implements ReactionsRepository {
  public constructor(
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async save(postId: string, userId: string, type: PostReaction['type']): Promise<SaveReactionOutcome> {
    return this.saveSql.save(postId, userId, type);
  }
  public async delete(postId: string, userId: string): Promise<DeleteReactionOutcome> {
    return this.deleteSql.delete(postId, userId);
  }
}
