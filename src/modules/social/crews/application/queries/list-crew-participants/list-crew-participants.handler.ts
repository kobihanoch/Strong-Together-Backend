import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../core/application/cursor-pagination';
import type { CrewParticipantsPage } from '../../models/crews.models';
import { CrewsQueries } from '../../ports/crews.queries';
import { ListCrewParticipantsQuery } from './list-crew-participants.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Lists active participants of an accessible crew. */
@QueryHandler(ListCrewParticipantsQuery)
export class ListCrewParticipantsHandler implements IQueryHandler<ListCrewParticipantsQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: CrewsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param limit - Page size.
   * @param cursor - Previous page cursor.
   * @returns A participant page.
   */
  public async execute(query: ListCrewParticipantsQuery): Promise<CrewParticipantsPage> {
    const { userId, crewId, limit, cursor } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const decoded = decodeSocialCursor(cursor);
      const rows = await this.query.listParticipants(
        crewId,
        limit,
        decoded ? { timestamp: decoded.timestamp, id: decoded.id, rank: decoded.rank } : undefined,
      );
      const participants = rows.slice(0, limit);
      const last = participants.at(-1);
      const rank = last?.role === 'leader' ? 1 : last?.role === 'admin' ? 2 : 3;
      return { participants, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.joinedAt, id: last.id, rank }) : null };
    });
  }
}
