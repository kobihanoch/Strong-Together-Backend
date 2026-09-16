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
   * @returns Visible post rows with like and comment counts, ordered from newest to oldest.
   */
  queryVisiblePosts(limit: number, cursor?: { timestamp: string; id: string }): Promise<PostQueryDto[]> {
    return this.sql<PostQueryDto[]>`
      SELECT
        post.id,
        post.author_user_id AS "authorUserId",
        post.workout_summary_id AS "workoutSummaryId",
        post.content,
        post.visibility,
        post.published_at AS "publishedAt",
        post.updated_at AS "updatedAt",
        post.username,
        post.full_name AS "fullName",
        post.profile_pic_path AS "profilePicPath",
        post.interactions
      FROM
        social.v_post_expanded post
      WHERE
        ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
        OR (DATE_TRUNC('milliseconds', post.published_at), post.id) < (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
          ${cursor?.id ?? null}::UUID
        )
      ORDER BY
        DATE_TRUNC('milliseconds', post.published_at) DESC,
        post.id DESC
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
   * @returns Crew post rows with like and comment counts, ordered from newest to oldest.
   */
  queryCrewPosts(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostQueryDto[]> {
    return this.sql<PostQueryDto[]>`
      SELECT
        post.id,
        post.author_user_id AS "authorUserId",
        post.workout_summary_id AS "workoutSummaryId",
        post.content,
        post.visibility,
        post.published_at AS "publishedAt",
        post.updated_at AS "updatedAt",
        post.username,
        post.full_name AS "fullName",
        post.profile_pic_path AS "profilePicPath",
        post.interactions
      FROM
        social.v_post_expanded post
        INNER JOIN social.crew_shared_post csp ON csp.post_id = post.id
      WHERE
        csp.crew_id = ${crewId}::UUID
        AND (
          ${cursor?.timestamp ?? null}::TIMESTAMPTZ IS NULL
          OR (DATE_TRUNC('milliseconds', post.published_at), post.id) < (
            ${cursor?.timestamp ?? null}::TIMESTAMPTZ,
            ${cursor?.id ?? null}::UUID
          )
        )
      ORDER BY
        DATE_TRUNC('milliseconds', post.published_at) DESC,
        post.id DESC
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
  async queryCreatePost(
    userId: string,
    content: string,
    visibility: 'crews_only' | 'public',
    crewIds: string[],
    workoutSummaryId?: string | null,
  ): Promise<Omit<PostQueryDto, 'username' | 'fullName' | 'profilePicPath' | 'interactions'>[]> {
    const [post] = await this.sql<Omit<PostQueryDto, 'username' | 'fullName' | 'profilePicPath' | 'interactions'>[]>`
      INSERT INTO
        social.post (author_user_id, workout_summary_id, content, visibility)
      VALUES
        (
          ${userId}::UUID,
          ${workoutSummaryId ?? null}::UUID,
          ${content},
          ${visibility}::social."Post Visibility"
        )
      RETURNING
        id,
        author_user_id AS "authorUserId",
        workout_summary_id AS "workoutSummaryId",
        content,
        visibility,
        published_at AS "publishedAt",
        updated_at AS "updatedAt"
    `;

    if (crewIds.length > 0) {
      await this.sql`
        INSERT INTO
          social.crew_shared_post (crew_id, post_id)
        SELECT DISTINCT
          requested_crew.id,
          ${post.id}::UUID
        FROM
          UNNEST(${crewIds}::UUID[]) AS requested_crew (id)
        RETURNING
          id
      `;
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
      RETURNING
        id
    `;
  }
}
