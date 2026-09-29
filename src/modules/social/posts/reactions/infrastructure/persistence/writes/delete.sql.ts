import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
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
   * @returns The deleted reaction identifier, or no row when it does not exist.
   */
  public async delete(postId: string) {
    const rows = await this.dbService.sql<ReactionWriteSqlRow[]>`
      DELETE FROM social.reaction
      WHERE
        post_id = ${postId}::UUID
        AND user_id = identity.current_user_id ()
      RETURNING
        id
    `;
    return rows.length > 0;
  }
}
