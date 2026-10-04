import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../../core/application/cursor-pagination';
import type { CommentsPage } from '../../models/comments.models';
import { CommentsQueries } from '../../ports/comments.queries';
import { ListPostCommentsQuery } from './list-post-comments.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists comments for a visible post. */

@QueryHandler(ListPostCommentsQuery)
export class ListPostCommentsHandler implements IQueryHandler<ListPostCommentsQuery> {
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
  public async execute(query: ListPostCommentsQuery): Promise<CommentsPage> {
    const { userId, postId, limit, cursor } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const rows = await this.query.list(postId, limit, decodeSocialCursor(cursor));
      const comments = rows.slice(0, limit);
      const last = comments.at(-1);
      return { comments, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
    });
  }
}
