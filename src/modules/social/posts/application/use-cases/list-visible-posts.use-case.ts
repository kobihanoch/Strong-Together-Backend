import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { PostsPage } from '../models/posts.models';
import { PostsRepository } from '../ports/posts.repository';

/** Lists all posts visible to the caller. */

@Injectable()
export class ListVisiblePostsUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PostsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param limit - Page size.
   * @param cursor - Previous cursor.
   * @returns A page of visible posts.
   */
  public async execute(userId: string, limit: number, cursor?: string): Promise<PostsPage> {
    return this.unitOfWork.execute(userId, async () => {
      const rows = await this.repository.listVisible(limit, decodeSocialCursor(cursor));
      const posts = rows.slice(0, limit);
      const last = posts.at(-1);
      return { posts, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.publishedAt, id: last.id }) : null };
    });
  }
}
