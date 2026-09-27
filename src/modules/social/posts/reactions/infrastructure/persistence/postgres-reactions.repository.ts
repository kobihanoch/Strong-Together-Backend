import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import type { DeleteReactionOutcome, SaveReactionOutcome } from '../../application/models/reactions.models';
import { ReactionsRepository } from '../../application/ports/reactions.repository';
import type { PostReactionSelection } from '../../domain/entities/post-reaction-selection';
/** PostgreSQL implementation of reaction persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresReactionsRepository implements ReactionsRepository {
  public constructor(
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public async save(postId: string, userId: string, reaction: PostReactionSelection): Promise<SaveReactionOutcome> {
    return this.saveSql.save(postId, userId, reaction.type.value);
  }
  public async delete(postId: string, userId: string): Promise<DeleteReactionOutcome> {
    return this.deleteSql.delete(postId, userId);
  }
}
