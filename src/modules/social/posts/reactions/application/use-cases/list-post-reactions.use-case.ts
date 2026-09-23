import { Injectable } from '@nestjs/common';
import { decodeSocialCursor, encodeSocialCursor } from '../../../../core/application/cursor-pagination';
import type { ReactionsPage } from '../models/reactions.models';
import { ReactionsRepository } from '../ports/reactions.repository';

/** Lists reactions for a visible post. */

@Injectable()
export class ListPostReactionsUseCase {
  public constructor(private readonly repository: ReactionsRepository) {}
  /**
   * Executes the application operation.
   *
   * @param postId - Post identifier.
   * @param limit - Page size.
   * @param cursor - Previous cursor.
   * @returns A page of reactions.
   */
  public async execute(postId: string, limit: number, cursor?: string): Promise<ReactionsPage> {
    const rows = await this.repository.list(postId, limit, decodeSocialCursor(cursor));
    const reactions = rows.slice(0, limit);
    const last = reactions.at(-1);
    return { reactions, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.reactedAt, id: last.id }) : null };
  }
}
