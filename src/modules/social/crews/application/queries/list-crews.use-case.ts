import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { CrewsPage } from '../models/crews.models';
import { CrewsQueries } from '../ports/crews.queries';

/** Lists crews visible to the caller. */
@Injectable()
export class ListCrewsUseCase {
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
  public async execute(userId: string, limit: number, cursor?: string, search?: string): Promise<CrewsPage> {
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const rows = await this.query.list(limit, decodeSocialCursor(cursor), search);
      const crews = rows.slice(0, limit);
      const last = crews.at(-1);
      return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
    });
  }
}
