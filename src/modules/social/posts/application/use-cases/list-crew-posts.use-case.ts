import { Injectable } from '@nestjs/common';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { PostsPage } from '../models/posts.models';
import { PostsRepository } from '../ports/posts.repository';

/** Lists posts for one accessible crew. */

@Injectable()
export class ListCrewPostsUseCase {
  public constructor(private readonly repository: PostsRepository) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param limit - Page size.
   * @param cursor - Previous cursor.
   * @returns A page of crew posts.
   */
  public async execute(crewId: string, limit: number, cursor?: string): Promise<PostsPage> {
    const rows = await this.repository.listForCrew(crewId, limit, decodeSocialCursor(cursor));
    const posts = rows.slice(0, limit);
    const last = posts.at(-1);
    return { posts, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.publishedAt, id: last.id }) : null };
  }
}
