import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PostForUpdateSqlRow } from '../posts.db-types';

/** Loads and locks a post aggregate for mutation. */
@Injectable()
export class FindPostByIdForUpdateSql {
  public constructor(private readonly dbService: DBService) {}

  public async findByIdForUpdate(id: string) {
    const [post] = await this.dbService.sql<PostForUpdateSqlRow[]>`
      SELECT
        post.id,
        post.author_user_id AS "authorUserId",
        post.workout_summary_id AS "workoutSummaryId",
        post.content,
        post.visibility,
        COALESCE(
          (
            SELECT
              ARRAY_AGG(
                shared.crew_id
                ORDER BY
                  shared.crew_id
              )
            FROM
              social.crew_shared_post shared
            WHERE
              shared.post_id = post.id
          ),
          ARRAY[]::UUID[]
        ) AS "crewIds"
      FROM
        social.post post
      WHERE
        post.id = ${id}::UUID
      FOR UPDATE OF
        post
    `;
    return post;
  }
}
