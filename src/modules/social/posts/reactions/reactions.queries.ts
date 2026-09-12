import { Inject, Injectable } from '@nestjs/common';
import type { ReactionQueryDto, ReactionWriteResultQueryDto, ReactToPostBody } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../../infrastructure/db/db.tokens';

/** Executes reaction writes inside the current request's RLS transaction. */
@Injectable()
export class ReactionsQueries {
  /**
   * Creates the query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Lists reactions on a post visible to the caller, newest first.
   *
   * @param postId - The post UUID.
   * @param limit - The requested page size.
   * @param cursor - The preceding page's final reaction timestamp and UUID.
   * @returns At most one extra row beyond the requested page size.
   */
  public queryPostReactions(postId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<ReactionQueryDto[]> {
    return this.sql<ReactionQueryDto[]>`
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

  /**
   * Creates or changes the caller's single reaction to a visible post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @param type - The selected reaction type.
   * @returns The written reaction identifier, or no row when the post is not visible.
   */
  public queryReact(postId: string, userId: string, type: ReactToPostBody['type']): Promise<ReactionWriteResultQueryDto[]> {
    return this.sql<ReactionWriteResultQueryDto[]>`
      INSERT INTO
        social.reaction (post_id, user_id, type)
      SELECT
        ${postId}::UUID,
        ${userId}::UUID,
        ${type}::social."Reaction Type"
      WHERE
        social.can_view_post (${postId}::UUID)
      ON CONFLICT (post_id, user_id) DO UPDATE
      SET
        type = EXCLUDED.type,
        reacted_at = NOW()
      RETURNING
        id
    `;
  }

  /**
   * Deletes the caller's reaction from a post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @returns The deleted reaction identifier, or no row when it does not exist.
   */
  public queryDeleteReaction(postId: string, userId: string): Promise<ReactionWriteResultQueryDto[]> {
    return this.sql<ReactionWriteResultQueryDto[]>`
      DELETE FROM social.reaction
      WHERE
        post_id = ${postId}::UUID
        AND user_id = ${userId}::UUID
      RETURNING
        id
    `;
  }
}
