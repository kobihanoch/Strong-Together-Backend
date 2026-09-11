import { Inject, Injectable } from '@nestjs/common';
import type { DeletedPostQueryDto, PostQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

/**
 * Executes post persistence operations inside the request's RLS transaction.
 * Post visibility is derived from the post row and its optional crew placement.
 */
@Injectable()
export class PostsQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves all global and crew posts visible to the authenticated user.
   *
   * @param userId - The UUID used to authorize crew-post visibility.
   * @returns Visible post rows ordered from newest to oldest.
   */
  queryPosts(userId: string): Promise<PostQueryDto[]> {
    return this.sql<PostQueryDto[]>`
      SELECT
        p.id,
        p.author_user_id AS "authorUserId",
        p.content,
        p.published_at AS "publishedAt",
        p.updated_at AS "updatedAt",
        csp.crew_id AS "crewId"
      FROM
        social.post p
        LEFT JOIN social.crew_shared_post csp ON csp.post_id = p.id
      WHERE
        p.author_user_id = ${userId}::UUID
        OR csp.id IS NULL
        OR EXISTS (
          SELECT
            1
          FROM
            social.crew c
            LEFT JOIN social.crew_membership cm ON cm.crew_id = c.id
            AND cm.user_id = ${userId}::UUID
            AND cm.status = 'active'
          WHERE
            c.id = csp.crew_id
            AND (
              c.leader_id = ${userId}::UUID
              OR cm.id IS NOT NULL
            )
        )
      ORDER BY
        p.published_at DESC
    `;
  }

  /**
   * Retrieves one post and its optional crew placement when visible through RLS.
   *
   * @param id - The UUID of the post to retrieve.
   * @param userId - The UUID used to authorize post visibility.
   * @returns An array containing the matching post, or an empty array.
   */
  queryPost(id: string, userId: string): Promise<PostQueryDto[]> {
    return this.sql<PostQueryDto[]>`
      SELECT
        p.id,
        p.author_user_id AS "authorUserId",
        p.content,
        p.published_at AS "publishedAt",
        p.updated_at AS "updatedAt",
        csp.crew_id AS "crewId"
      FROM
        social.post p
        LEFT JOIN social.crew_shared_post csp ON csp.post_id = p.id
      WHERE
        p.id = ${id}::UUID
        AND (
          p.author_user_id = ${userId}::UUID
          OR csp.id IS NULL
          OR EXISTS (
            SELECT
              1
            FROM
              social.crew c
              LEFT JOIN social.crew_membership cm ON cm.crew_id = c.id
              AND cm.user_id = ${userId}::UUID
              AND cm.status = 'active'
            WHERE
              c.id = csp.crew_id
              AND (
                c.leader_id = ${userId}::UUID
                OR cm.id IS NOT NULL
              )
          )
        )
    `;
  }

  /**
   * Creates a post and optionally places it in a crew.
   * Omitting the crew UUID leaves the post without a placement, which represents
   * a global post in the social model.
   *
   * @param userId - The UUID of the authenticated post author.
   * @param content - The textual content of the post.
   * @param crewId - The optional UUID of the crew receiving the post.
   * @returns An array containing the newly created post and its placement.
   */
  async queryCreatePost(userId: string, content: string, crewId?: string): Promise<PostQueryDto[]> {
    const [p] = await this.sql<PostQueryDto[]>`
      INSERT INTO
        social.post (author_user_id, content)
      VALUES
        (
          ${userId}::UUID,
          ${content}
        )
      RETURNING
        id,
        author_user_id AS "authorUserId",
        content,
        published_at AS "publishedAt",
        updated_at AS "updatedAt",
        NULL::UUID AS "crewId"
    `;
    if (crewId) {
      const placement = await this.sql`
        INSERT INTO
          social.crew_shared_post (crew_id, post_id)
        SELECT
          ${crewId}::UUID,
          ${p.id}::UUID
        WHERE
          EXISTS (
            SELECT
              1
            FROM
              social.crew c
              LEFT JOIN social.crew_membership cm ON cm.crew_id = c.id
              AND cm.user_id = ${userId}::UUID
              AND cm.status = 'active'
            WHERE
              c.id = ${crewId}::UUID
              AND (
                c.leader_id = ${userId}::UUID
                OR cm.id IS NOT NULL
              )
          )
        RETURNING
          id
      `;

      if (!placement.length) return [];
    }

    return [{ ...p, crewId: crewId ?? null }];
  }

  /**
   * Updates the content of a post permitted by RLS.
   * The post is queried again after the update so its crew placement is included
   * in the returned DTO.
   *
   * @param id - The UUID of the post to update.
   * @param userId - The UUID that must match the post author.
   * @param content - The replacement textual content.
   * @returns An array containing the updated post, or an empty array.
   */
  async queryUpdatePost(id: string, userId: string, content: string): Promise<PostQueryDto[]> {
    const rows = await this.sql<PostQueryDto[]>`
      UPDATE social.post
      SET
        content = ${content},
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
        AND author_user_id = ${userId}::UUID
      RETURNING
        id,
        author_user_id AS "authorUserId",
        content,
        published_at AS "publishedAt",
        updated_at AS "updatedAt",
        NULL::UUID AS "crewId"
    `;
    if (!rows.length) return rows;
    return this.queryPost(rows[0].id, userId);
  }

  /**
   * Deletes a post permitted by the current RLS context.
   *
   * @param id - The UUID of the post to delete.
   * @param userId - The UUID that must match the post author.
   * @returns The deleted UUID when a row was removed, or an empty array.
   */
  queryDeletePost(id: string, userId: string): Promise<DeletedPostQueryDto[]> {
    return this.sql<DeletedPostQueryDto[]>`
      DELETE FROM social.post
      WHERE
        id = ${id}::UUID
        AND author_user_id = ${userId}::UUID
      RETURNING
        id
    `;
  }
}
