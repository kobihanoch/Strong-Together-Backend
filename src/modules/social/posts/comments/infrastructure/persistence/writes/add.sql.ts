import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../../infrastructure/db/db.service';
import type { CommentWriteSqlRow } from '../comments.db-types';

/** Executes comment writes inside the current request's RLS transaction. */

@Injectable()
export class AddSql {
  /**
   * Creates the comment query repository.
   *
   * @param sql - The transaction-scoped PostgreSQL client.
   */
  public constructor(private readonly dbService: DBService) {}
  /**
   * Adds a comment to a post visible to the caller.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @param content - The validated comment text.
   * @returns The created comment identifier, or no row when the post is not visible.
   */
  public add(postId: string, userId: string, content: string): Promise<CommentWriteSqlRow[]> {
    return this.dbService.sql<CommentWriteSqlRow[]>`
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
}
