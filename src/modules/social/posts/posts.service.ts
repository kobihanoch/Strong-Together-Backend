import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreatePostBody, ListCrewPostsResponse, ListVisiblePostsResponse, PostQueryDto, UpdatePostBody } from '@strong-together/shared';
import { PostsQueries } from './posts.queries';

/** Coordinates social post CRUD operations and maps empty query results to HTTP errors. */
@Injectable()
export class PostsService {
  constructor(private readonly queries: PostsQueries) {}

  /**
   * Lists the paginated global and crew posts visible to the caller.
   *
   * @param userId - The authenticated user's UUID used for authorization.
   * @param limit - The maximum number of posts to return.
   * @param offset - The number of visible posts to skip.
   * @returns A response object containing visible posts.
   */
  async getVisiblePostsData(userId: string, limit: number, offset: number): Promise<ListVisiblePostsResponse> {
    return { posts: await this.queries.queryVisiblePosts(userId, limit, offset) };
  }

  /**
   * Lists a page of posts shared in a crew the caller can access.
   *
   * @param crewId - The crew whose feed is requested.
   * @param userId - The authenticated user's UUID used for authorization.
   * @param limit - The maximum number of posts to return.
   * @param offset - The number of matching crew posts to skip.
   * @returns A response object containing the crew's visible posts.
   */
  async getCrewPostsData(crewId: string, userId: string, limit: number, offset: number): Promise<ListCrewPostsResponse> {
    return { posts: await this.queries.queryCrewPosts(crewId, userId, limit, offset) };
  }

  /**
   * Gets one visible post.
   *
   * @param id - The post UUID.
   * @returns The matching post and optional crew placement.
   * @throws NotFoundException when the query returns no visible post.
   */
  async getPostData(id: string, userId: string): Promise<PostQueryDto> {
    const [r] = await this.queries.queryPost(id, userId);
    if (!r) throw new NotFoundException('Post not found');
    return r;
  }

  /**
   * Creates a global or crew-placed post for the authenticated author.
   *
   * @param userId - The authenticated author's UUID.
   * @param body - The validated post creation data.
   * @returns A promise that resolves after creation.
   */
  async createPostData(userId: string, body: CreatePostBody): Promise<void> {
    const [r] = await this.queries.queryCreatePost(userId, body.content, body.crewId);
    if (!r) throw new ForbiddenException('You cannot post to this crew');
  }

  /**
   * Updates the content of a post through RLS.
   *
   * @param id - The post UUID.
   * @param body - The validated post update data.
   * @returns A promise that resolves after the update.
   * @throws NotFoundException when no permitted post is updated.
   */
  async updatePostData(id: string, userId: string, body: UpdatePostBody): Promise<void> {
    const [r] = await this.queries.queryUpdatePost(id, userId, body.content);
    if (!r) throw new NotFoundException('Post not found');
  }

  /**
   * Deletes a post through the caller's RLS transaction.
   *
   * @param id - The post UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when no permitted post is deleted.
   */
  async deletePostData(id: string, userId: string): Promise<void> {
    if (!(await this.queries.queryDeletePost(id, userId)).length) throw new NotFoundException('Post not found');
  }
}
