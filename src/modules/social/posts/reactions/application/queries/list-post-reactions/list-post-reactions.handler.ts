import { UnitOfWork } from '../../../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../../core/application/cursor-pagination';
import type { ReactionsPage } from '../../models/reactions.models';
import { ReactionsQueries } from '../../ports/reactions.queries';
import { ListPostReactionsQuery } from './list-post-reactions.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists reactions for a visible post. */

@QueryHandler(ListPostReactionsQuery)
export class ListPostReactionsHandler implements IQueryHandler<ListPostReactionsQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: ReactionsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param postId - Post identifier.
   * @param limit - Page size.
   * @param cursor - Previous cursor.
   * @returns A page of reactions.
   */
  public async execute(query: ListPostReactionsQuery): Promise<ReactionsPage> {
    const { userId, postId, limit, cursor } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const rows = await this.query.list(postId, limit, decodeSocialCursor(cursor));
      const reactions = rows.slice(0, limit);
      const last = reactions.at(-1);
      return { reactions, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.reactedAt, id: last.id }) : null };
    });
  }
}
