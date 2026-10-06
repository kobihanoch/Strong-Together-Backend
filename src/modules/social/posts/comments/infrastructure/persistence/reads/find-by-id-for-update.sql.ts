import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/connections/postgres/db.service';
import type { CommentForUpdateSqlRow } from '../comments.db-types';

/** Loads and locks a comment aggregate for editing. */
@Injectable()
export class FindCommentByIdForUpdateSql {
  public constructor(private readonly dbService: DBService) {}

  public async findByIdForUpdate(id: string) {
    const [comment] = await this.dbService.sql<CommentForUpdateSqlRow[]>`
      SELECT
        id,
        post_id AS "postId",
        user_id AS "authorUserId",
        content
      FROM
        social.comment
      WHERE
        id = ${id}::UUID
      FOR UPDATE
    `;
    return comment;
  }
}
