import { Inject, Injectable } from '@nestjs/common';
import type { DeletedPostQueryDto, PostQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

/** Executes post persistence operations inside the request's RLS transaction. */
@Injectable()
export class PostsQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves each post visible to the authenticated user exactly once.
   *
   * @param limit - The maximum number of posts to return.
   * @param cursor - The preceding page's final publication timestamp and UUID.
   * @returns Visible post rows ordered from newest to oldest.
   */
  queryVisiblePosts(limit: number, cursor?: { timestamp: string; id: string }): Promise<PostQueryDto[]> {
    return this.sql<PostQueryDto[]>`
      SELECT
        p.id,
        p.author_user_id AS "authorUserId",
        p.content,
        p.visibility,
        p.published_at AS "publishedAt",
        p.updated_at AS "updatedAt"
      FROM
        social.post p
      WHERE
        social.can_view_post (p.id)
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (DATE_TRUNC('milliseconds', p.published_at), p.id) < (
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        DATE_TRUNC('milliseconds', p.published_at) DESC,
        p.id DESC
      LIMIT
        ${limit + 1}
    `;
  }

  /**
   * Retrieves a page of posts from a crew the caller can access.
   *
   * @param crewId - The UUID of the crew whose posts are requested.
   * @param limit - The maximum number of posts to return.
   * @param cursor - The preceding page's final publication timestamp and UUID.
   * @returns Crew post rows ordered from newest to oldest.
   */
  queryCrewPosts(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostQueryDto[]> {
    return this.sql<PostQueryDto[]>`
      SELECT
        p.id,
        p.author_user_id AS "authorUserId",
        p.content,
        p.visibility,
        p.published_at AS "publishedAt",
        p.updated_at AS "updatedAt"
      FROM
        social.post p
        INNER JOIN social.crew_shared_post csp ON csp.post_id = p.id
      WHERE
        csp.crew_id = ${crewId}::UUID
        AND social.can_access_crew (${crewId}::UUID)
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (DATE_TRUNC('milliseconds', p.published_at), p.id) < (
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        DATE_TRUNC('milliseconds', p.published_at) DESC,
        p.id DESC
      LIMIT
        ${limit + 1}
    `;
  }

  /**
   * Creates a post and places it in every requested crew.
   *
   * @param userId - The UUID of the authenticated post author.
   * @param content - The textual content of the post.
   * @param visibility - Whether everyone or only eligible crew participants can see the post.
   * @param crewIds - The UUIDs of the crews receiving the post.
   * @returns The new post, or an empty array when any placement is unauthorized.
   */
  async queryCreatePost(userId: string, content: string, visibility: 'crews_only' | 'public', crewIds: string[]): Promise<PostQueryDto[]> {
    const [post] = await this.sql<PostQueryDto[]>`
      INSERT INTO
        social.post (author_user_id, content, visibility)
      VALUES
        (
          ${userId}::UUID,
          ${content},
          ${visibility}::social."Post Visibility"
        )
      RETURNING
        id,
        author_user_id AS "authorUserId",
        content,
        visibility,
        published_at AS "publishedAt",
        updated_at AS "updatedAt"
    `;

    if (crewIds.length > 0) {
      const placements = await this.sql`
        INSERT INTO
          social.crew_shared_post (crew_id, post_id)
        SELECT DISTINCT
          requested_crew.id,
          ${post.id}::UUID
        FROM
          UNNEST(${crewIds}::UUID[]) AS requested_crew (id)
        WHERE
          social.can_publish_to_crew (requested_crew.id)
        RETURNING
          id
      `;

      // The surrounding request transaction rolls back when any requested crew is unauthorized.
      if (placements.length !== new Set(crewIds).size) return [];
    }

    return [post];
  }

  /**
   * Updates content only when the current user authored the post.
   *
   * @param id - The UUID of the post to update.
   * @param content - The replacement textual content.
   * @returns The updated UUID, or an empty array when no post was authorized.
   */
  queryUpdatePost(id: string, content: string): Promise<DeletedPostQueryDto[]> {
    return this.sql<DeletedPostQueryDto[]>`
      UPDATE social.post
      SET
        content = ${content},
        updated_at = NOW()
      WHERE
        id = ${id}::UUID
        AND social.is_post_author (id)
      RETURNING
        id
    `;
  }

  /**
   * Deletes a post only when the current user authored it.
   *
   * @param id - The UUID of the post to delete.
   * @returns The deleted UUID, or an empty array when no post was authorized.
   */
  queryDeletePost(id: string): Promise<DeletedPostQueryDto[]> {
    return this.sql<DeletedPostQueryDto[]>`
      DELETE FROM social.post
      WHERE
        id = ${id}::UUID
        AND social.is_post_author (id)
      RETURNING
        id
    `;
  }
}
