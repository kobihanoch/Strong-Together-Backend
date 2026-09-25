import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/db/db.service';
import type { ReactionWriteSqlRow } from '../reactions.db-types';

/** Executes reaction writes inside the current request's RLS transaction. */

@Injectable()
export class DeleteSql {
  /**
   * Creates the query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Deletes the caller's reaction from a post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @returns The deleted reaction identifier, or no row when it does not exist.
   */
  public delete(postId: string, userId: string): Promise<ReactionWriteSqlRow[]> {
    return this.dbService.sql<ReactionWriteSqlRow[]>`
      DELETE FROM social.reaction
      WHERE
        post_id = ${postId}::UUID
        AND user_id = ${userId}::UUID
      RETURNING
        id
    `;
  }
}
