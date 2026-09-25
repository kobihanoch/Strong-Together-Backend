import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { PostsPage } from '../models/posts.models';
import { PostsQueries } from '../ports/posts.queries';

/** Lists posts for one accessible crew. */

@Injectable()
export class ListCrewPostsUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: PostsQueries,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param limit - Page size.
   * @param cursor - Previous cursor.
   * @returns A page of crew posts.
   */
  public async execute(userId: string, crewId: string, limit: number, cursor?: string): Promise<PostsPage> {
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const rows = await this.query.listForCrew(crewId, limit, decodeSocialCursor(cursor));
      const posts = rows.slice(0, limit);
      const last = posts.at(-1);
      return { posts, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.publishedAt, id: last.id }) : null };
    });
  }
}
