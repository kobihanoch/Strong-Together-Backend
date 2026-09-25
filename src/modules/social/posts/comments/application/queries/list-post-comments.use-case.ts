import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../core/application/cursor-pagination';
import type { CommentsPage } from '../models/comments.models';
import { CommentsQueries } from '../ports/comments.queries';

/** Lists comments for a visible post. */

@Injectable()
export class ListPostCommentsUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CommentsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param postId - Post identifier.
   * @param limit - Page size.
   * @param cursor - Previous cursor.
   * @returns A page of comments.
   */
  public async execute(userId: string, postId: string, limit: number, cursor?: string): Promise<CommentsPage> {
    return this.unitOfWork.execute(userId, async () => {
      const rows = await this.query.list(postId, limit, decodeSocialCursor(cursor));
      const comments = rows.slice(0, limit);
      const last = comments.at(-1);
      return { comments, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
    });
  }
}
