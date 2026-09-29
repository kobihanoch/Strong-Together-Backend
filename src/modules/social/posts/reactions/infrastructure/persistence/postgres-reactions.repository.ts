import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import { ReactionsRepository } from '../../application/ports/reactions.repository';
import type { PostReaction } from '../../domain/entities/post-reaction';
/** PostgreSQL implementation of reaction persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresReactionsRepository implements ReactionsRepository {
  public constructor(
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  public save(reaction: PostReaction): Promise<boolean> {
    return this.saveSql.save(reaction.postId, reaction.userId, reaction.type.value);
  }
  public async delete(postId: string, userId: string): Promise<boolean> {
    return this.deleteSql.delete(postId, userId);
  }
}
