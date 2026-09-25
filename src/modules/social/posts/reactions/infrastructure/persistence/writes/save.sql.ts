import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { ReactionDbType, ReactionWriteSqlRow } from '../reactions.db-types';

/** Executes reaction writes inside the current request's RLS transaction. */

@Injectable()
export class SaveSql {
  /**
   * Creates the query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Creates or changes the caller's single reaction to a visible post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @param type - The selected reaction type.
   * @returns The written reaction identifier, or no row when the post is not visible.
   */
  public async save(postId: string, userId: string, type: ReactionDbType) {
    const rows = await this.dbService.sql<ReactionWriteSqlRow[]>`
      INSERT INTO
        social.reaction (post_id, user_id, type)
      VALUES
        (
          ${postId}::UUID,
          ${userId}::UUID,
          ${type}::social."Reaction Type"
        )
      ON CONFLICT (post_id, user_id) DO UPDATE
      SET
        type = EXCLUDED.type,
        reacted_at = NOW()
      RETURNING
        id
    `;
    return rows.length > 0 ? { kind: 'saved' as const } : { kind: 'post-not-found' as const };
  }
}
