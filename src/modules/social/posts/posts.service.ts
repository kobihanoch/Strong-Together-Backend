import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreatePostBody, ListCrewPostsResponse, ListVisiblePostsResponse, UpdatePostBody } from '@strong-together/shared';
import { decodeSocialCursor, encodeSocialCursor } from '../cursor-pagination';
import { PostsQueries } from './posts.queries';

/** Coordinates social post CRUD operations and maps empty query results to HTTP errors. */
@Injectable()
export class PostsService {
  constructor(private readonly queries: PostsQueries) {}

  /**
   * Lists the paginated global and crew posts visible to the caller.
   *
   * @param limit - The maximum number of posts to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns A response object containing visible posts.
   */
  async getVisiblePostsData(limit: number, cursor?: string): Promise<ListVisiblePostsResponse> {
    const rows = await this.queries.queryVisiblePosts(limit, decodeSocialCursor(cursor));
    const posts = rows.slice(0, limit);
    const last = posts.at(-1);
    return { posts, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.publishedAt, id: last.id }) : null };
  }

  /**
   * Lists a page of posts shared in a crew the caller can access.
   *
   * @param crewId - The crew whose feed is requested.
   * @param limit - The maximum number of posts to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns A response object containing the crew's visible posts.
   */
  async getCrewPostsData(crewId: string, limit: number, cursor?: string): Promise<ListCrewPostsResponse> {
    const rows = await this.queries.queryCrewPosts(crewId, limit, decodeSocialCursor(cursor));
    const posts = rows.slice(0, limit);
    const last = posts.at(-1);
    return { posts, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.publishedAt, id: last.id }) : null };
  }

  /**
   * Creates a global or crew-placed post for the authenticated author.
   *
   * @param userId - The authenticated author's UUID.
   * @param body - The validated post creation data.
   * @returns A promise that resolves after creation.
   */
  async createPostData(userId: string, body: CreatePostBody): Promise<void> {
    if (body.visibility === 'crews_only' && body.crewIds.length === 0) {
      throw new BadRequestException('Crew-only post must target at least one crew');
    }
    await this.queries.queryCreatePost(userId, body.content, body.visibility, body.crewIds);
  }

  /**
   * Updates the content of a post through RLS.
   *
   * @param id - The post UUID.
   * @param body - The validated post update data.
   * @returns A promise that resolves after the update.
   * @throws NotFoundException when no permitted post is updated.
   */
  async updatePostData(id: string, body: UpdatePostBody): Promise<void> {
    const [r] = await this.queries.queryUpdatePost(id, body.content);
    if (!r) throw new NotFoundException('Post not found');
  }

  /**
   * Deletes a post through the caller's RLS transaction.
   *
   * @param id - The post UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when no permitted post is deleted.
   */
  async deletePostData(id: string): Promise<void> {
    if (!(await this.queries.queryDeletePost(id)).length) throw new NotFoundException('Post not found');
  }
}
