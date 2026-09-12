import { Inject, Injectable } from '@nestjs/common';
import type { CommentQueryDto, CommentWriteResultQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../../infrastructure/db/db.tokens';

/** Executes comment writes inside the current request's RLS transaction. */
@Injectable()
export class CommentsQueries {
  /**
   * Creates the comment query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Lists comments on a post visible to the caller in conversation order.
   *
   * @param postId - The post UUID.
   * @param limit - The requested page size.
   * @param cursor - The preceding page's final creation timestamp and UUID.
   * @returns At most one extra row beyond the requested page size.
   */
  public queryPostComments(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<CommentQueryDto[]> {
    return this.sql<CommentQueryDto[]>`
      SELECT
        c.id,
        c.post_id AS "postId",
        c.user_id AS "userId",
        c.content,
        c.created_at AS "createdAt",
        c.updated_at AS "updatedAt"
      FROM
        social.comment c
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

  /**
   * Adds a comment to a post visible to the caller.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @param content - The validated comment text.
   * @returns The created comment identifier, or no row when the post is not visible.
   */
  public queryAddComment(postId: string, userId: string, content: string): Promise<CommentWriteResultQueryDto[]> {
    return this.sql<CommentWriteResultQueryDto[]>`
      INSERT INTO
        social.comment (post_id, user_id, content)
      VALUES
        (
          ${postId}::UUID,
          ${userId}::UUID,
          ${content}
        )
      RETURNING
        id
    `;
  }

  /**
   * Replaces the text of a comment owned by the caller.
   *
   * @param id - The comment UUID.
   * @param content - The validated replacement text.
   * @returns The updated comment identifier, or no row when it is unavailable.
   */
  public queryEditComment(id: string, content: string): Promise<CommentWriteResultQueryDto[]> {
    return this.sql<CommentWriteResultQueryDto[]>`
      UPDATE social.comment
      SET
        content = ${content},
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
  }

  /**
   * Deletes a comment owned by the caller.
   *
   * @param id - The comment UUID.
   * @returns The deleted comment identifier, or no row when it is unavailable.
   */
  public queryDeleteComment(id: string): Promise<CommentWriteResultQueryDto[]> {
    return this.sql<CommentWriteResultQueryDto[]>`
      DELETE FROM social.comment
      WHERE
        id = ${id}::UUID
      RETURNING
        id
    `;
  }
}
