import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../core/application/cursor-pagination';
import type { CrewsPage } from '../../models/crews.models';
import { CrewsQueries } from '../../ports/crews.queries';
import { ListMyCrewsQuery } from './list-my-crews.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists crews joined by the caller. */
@QueryHandler(ListMyCrewsQuery)
export class ListMyCrewsHandler implements IQueryHandler<ListMyCrewsQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CrewsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param limit - Page size.
   * @param cursor - Previous page cursor.
   * @returns A page of joined crews.
   */
  public async execute(query: ListMyCrewsQuery): Promise<CrewsPage> {
    const { userId, limit, cursor } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const rows = await this.query.listMine(limit, decodeSocialCursor(cursor));
      const crews = rows.slice(0, limit);
      const last = crews.at(-1);
      return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
    });
  }
}
