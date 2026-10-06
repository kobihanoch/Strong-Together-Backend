import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CommentSqlRow } from '../comments.db-types';

/** Executes comment writes inside the current request's RLS transaction. */

@Injectable()
export class ListForPostSql {
  /**
   * Creates the comment query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Lists comments on a post visible to the caller in conversation order.
   *
   * @param postId - The post UUID.
   * @param limit - The requested page size.
   * @param cursor - The preceding page's final creation timestamp and UUID.
   * @returns At most one extra row beyond the requested page size.
   */
  public listForPost(postId: string, limit: number, cursor?: { timestamp: string; id: string }) {
    return this.dbService.sql<CommentSqlRow[]>`
      SELECT
        c.id,
        c.post_id AS "postId",
        c.user_id AS "userId",
        c.content,
        c.created_at AS "createdAt",
        c.updated_at AS "updatedAt",
        author.name AS "authorFullName",
        author.username AS "authorUsername",
        author."profilePicPath" AS "authorProfilePicPath"
      FROM
        social.comment c
        CROSS JOIN LATERAL identity.get_user_profile (c.user_id) author
      WHERE
        c.post_id = ${postId}::UUID
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (DATE_TRUNC('milliseconds', c.created_at), c.id) > (
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        DATE_TRUNC('milliseconds', c.created_at),
        c.id
      LIMIT
        ${limit + 1}
    `;
  }
}
