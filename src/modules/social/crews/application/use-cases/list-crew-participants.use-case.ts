import { Injectable } from '@nestjs/common';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { CrewParticipantsPage } from '../models/crews.models';
import { CrewsRepository } from '../ports/crews.repository';

/** Lists active participants of an accessible crew. */
@Injectable()
export class ListCrewParticipantsUseCase {
  public constructor(private readonly repository: CrewsRepository) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param limit - Page size.
   * @param cursor - Previous page cursor.
   * @returns A participant page.
   */
  public async execute(crewId: string, limit: number, cursor?: string): Promise<CrewParticipantsPage> {
    const decoded = decodeSocialCursor(cursor);
    const rows = await this.repository.listParticipants(
      crewId,
      limit,
      decoded ? { timestamp: decoded.timestamp, id: decoded.id, rank: decoded.rank } : undefined,
    );
    const participants = rows.slice(0, limit);
    const last = participants.at(-1);
    const rank = last?.role === 'leader' ? 1 : last?.role === 'admin' ? 2 : 3;
    return { participants, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.joinedAt, id: last.id, rank }) : null };
  }
}
