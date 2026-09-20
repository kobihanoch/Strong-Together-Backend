import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import type {
  CreatePostBody,
  CreatePostResponse,
  DeletePostParams,
  ListCrewPostsParams,
  ListCrewPostsQuery,
  ListCrewPostsResponse,
  ListVisiblePostsQuery,
  ListVisiblePostsResponse,
  UpdatePostBody,
  UpdatePostParams,
  UpdatePostResponse,
} from '@strong-together/shared';
import {
  createPostRequestSchema,
  deletePostRequestSchema,
  listCrewPostsRequestSchema,
  listVisiblePostsRequestSchema,
  updatePostRequestSchema,
} from '@strong-together/shared';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { ListCrewPostsUseCase } from '../application/use-cases/list-crew-posts.use-case';
import { ListVisiblePostsUseCase } from '../application/use-cases/list-visible-posts.use-case';
import { UpdatePostUseCase } from '../application/use-cases/update-post.use-case';

/**
 * Exposes authenticated CRUD endpoints for social posts.
 *
 * Routes:
 * - GET /api/social/posts
 * - GET /api/social/posts/crew/:crewId
 * - POST /api/social/posts
 * - PATCH /api/social/posts/:id
 * - DELETE /api/social/posts/:id
 *
 * @remarks Every request passes DPoP, authentication, authorization, and the
 * RLS transaction interceptor. Visibility determines public access independently
 * from the optional crew placement.
 * Access: User
 */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class PostsController {
  public constructor(
    private readonly listVisiblePosts: ListVisiblePostsUseCase,
    private readonly listCrewPosts: ListCrewPostsUseCase,
    private readonly createPost: CreatePostUseCase,
    private readonly updatePost: UpdatePostUseCase,
    private readonly deletePost: DeletePostUseCase,
  ) {}

  /**
   * Lists posts visible to the authenticated user.
   *
   * API: GET /api/social/posts
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated pagination query.
   * @returns Global posts and crew posts the caller is authorized to view.
   */
  @Get()
  async getVisiblePosts(
    @RequestData(new ValidateRequestPipe(listVisiblePostsRequestSchema))
    data: {
      query: ListVisiblePostsQuery;
    },
  ): Promise<ListVisiblePostsResponse> {
    return this.listVisiblePosts.execute(data.query.limit, data.query.cursor);
  }

  /**
   * Lists posts shared in one crew when the caller belongs to that crew.
   *
   * API: GET /api/social/posts/crew/:crewId
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated crew identifier and pagination query.
   * @returns Posts shared in the requested crew, ordered newest first.
   */
  @Get('crew/:crewId')
  async getCrewPosts(
    @RequestData(new ValidateRequestPipe(listCrewPostsRequestSchema))
    data: {
      params: ListCrewPostsParams;
      query: ListCrewPostsQuery;
    },
  ): Promise<ListCrewPostsResponse> {
    return this.listCrewPosts.execute(data.params.crewId, data.query.limit, data.query.cursor);
  }

  /**
   * Creates a public or crew-only post and optionally shares it with multiple crews.
   *
   * API: POST /api/social/posts
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated post creation body.
   * @param user - The authenticated user supplied by the authentication guard.
   * @returns No response body with a 201 Created status.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @RequestData(new ValidateRequestPipe(createPostRequestSchema))
    data: { body: CreatePostBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreatePostResponse> {
    await this.createPost.execute(user.id, data.body);
  }

  /**
   * Updates the content of a post authored by the caller.
   *
   * API: PATCH /api/social/posts/:id
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated route parameters and update body.
   * @returns No response body with a 204 No Content status.
   * @throws {PostNotFoundError} When RLS exposes no matching post.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @RequestData(new ValidateRequestPipe(updatePostRequestSchema))
    data: {
      params: UpdatePostParams;
      body: UpdatePostBody;
    },
  ): Promise<UpdatePostResponse> {
    await this.updatePost.execute(data.params.id, data.body.content);
  }

  /**
   * Deletes a post authored by the caller.
   *
   * API: DELETE /api/social/posts/:id
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns No response body.
   * @throws {PostNotFoundError} When RLS exposes no matching post.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @RequestData(new ValidateRequestPipe(deletePostRequestSchema))
    data: {
      params: DeletePostParams;
    },
  ): Promise<void> {
    await this.deletePost.execute(data.params.id);
  }
}
