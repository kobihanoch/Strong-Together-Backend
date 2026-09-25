import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PostSqlRow } from '../posts.db-types';

/** Executes post persistence operations inside the request's RLS transaction. */

@Injectable()
export class ListForCrewSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves a page of posts from a crew the caller can access.
   *
   * @param crewId - The UUID of the crew whose posts are requested.
   * @param limit - The maximum number of posts to return.
   * @param cursor - The preceding page's final publication timestamp and UUID.
   * @returns Crew post rows with like and comment counts, ordered from newest to oldest.
   */
  listForCrew(crewId: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<PostSqlRow[]> {
    return this.dbService.sql<PostSqlRow[]>`
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
}
