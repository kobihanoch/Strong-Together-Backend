import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/db/db.service';
import type { ReactionSqlRow } from '../reactions.db-types';

/** Executes reaction writes inside the current request's RLS transaction. */

@Injectable()
export class ListForPostSql {
  /**
   * Creates the query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Lists reactions on a post visible to the caller, newest first.
   *
   * @param postId - The post UUID.
   * @param limit - The requested page size.
   * @param cursor - The preceding page's final reaction timestamp and UUID.
   * @returns At most one extra row beyond the requested page size.
   */
  public listForPost(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<ReactionSqlRow[]> {
    return this.dbService.sql<ReactionSqlRow[]>`
      SELECT
        r.id,
        r.post_id AS "postId",
        r.user_id AS "userId",
        r.type,
        r.reacted_at AS "reactedAt"
      FROM
        social.reaction r
      WHERE
        r.post_id = ${postId}::UUID
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (DATE_TRUNC('milliseconds', r.reacted_at), r.id) < (
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        DATE_TRUNC('milliseconds', r.reacted_at) DESC,
        r.id DESC
      LIMIT
        ${limit + 1}
    `;
  }
}
