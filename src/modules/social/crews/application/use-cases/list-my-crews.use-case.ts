import { Injectable } from '@nestjs/common';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { CrewsPage } from '../models/crews.models';
import { CrewsRepository } from '../ports/crews.repository';

/** Lists crews joined by the caller. */
@Injectable()
export class ListMyCrewsUseCase {
  public constructor(private readonly repository: CrewsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param limit - Page size.
   * @param cursor - Previous page cursor.
   * @returns A page of joined crews. */
  public async execute(limit: number, cursor?: string): Promise<CrewsPage> {
    const rows = await this.repository.listMine(limit, decodeSocialCursor(cursor));
    const crews = rows.slice(0, limit);
    const last = crews.at(-1);
    return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
  }
}
