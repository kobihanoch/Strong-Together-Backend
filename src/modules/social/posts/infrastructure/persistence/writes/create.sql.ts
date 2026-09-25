import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PostWriteSqlRow } from '../posts.db-types';

/** Executes post persistence operations inside the request's RLS transaction. */

@Injectable()
export class CreateSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Creates a post and places it in every requested crew.
   *
   * @param userId - The UUID of the authenticated post author.
   * @param content - The textual content of the post.
   * @param visibility - Whether everyone or only eligible crew participants can see the post.
   * @param crewIds - The UUIDs of the crews receiving the post.
   * @param workoutSummaryId - The workout summary id value.
   * @returns The new post, or an empty array when any placement is unauthorized.
   */
  async create(
    userId: string,
    content: string,
    visibility: 'crews_only' | 'public',
    crewIds: string[],
    workoutSummaryId?: string | null,
  ): Promise<PostWriteSqlRow[]> {
    const [post] = await this.dbService.sql<PostWriteSqlRow[]>`
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
      await this.dbService.sql`
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
}
