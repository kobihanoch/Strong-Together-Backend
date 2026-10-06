import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../core/application/cursor-pagination';
import type { CrewsPage } from '../../models/crews.models';
import { CrewsQueries } from '../../ports/crews.queries';
import { ListCrewsQuery } from './list-crews.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists crews visible to the caller. */
@QueryHandler(ListCrewsQuery)
export class ListCrewsHandler implements IQueryHandler<ListCrewsQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CrewsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param limit - Page size.
   * @param cursor - Previous page cursor.
   * @param search - Optional name filter.
   * @returns A page of visible crews.
   */
  public async execute(query: ListCrewsQuery): Promise<CrewsPage> {
    const { userId, limit, cursor, search } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const rows = await this.query.list(limit, decodeSocialCursor(cursor), search);
      const crews = rows.slice(0, limit);
      const last = crews.at(-1);
      return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
    });
  }
}
