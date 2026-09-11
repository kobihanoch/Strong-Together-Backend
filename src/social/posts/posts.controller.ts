import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  CreatePostBody,
  CreatePostResponse,
  DeletePostParams,
  GetPostParams,
  GetPostResponse,
  ListPostsResponse,
  UpdatePostBody,
  UpdatePostParams,
  UpdatePostResponse,
} from '@strong-together/shared';
import { createPostRequestSchema, deletePostRequestSchema, getPostRequestSchema, updatePostRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../common/types/express';
import { PostsService } from './posts.service';

/**
 * Exposes authenticated CRUD endpoints for social posts.
 *
 * Routes:
 * - GET /api/social/posts
 * - GET /api/social/posts/:id
 * - POST /api/social/posts
 * - PATCH /api/social/posts/:id
 * - DELETE /api/social/posts/:id
 *
 * @remarks Every request passes DPoP, authentication, authorization, and the
 * RLS transaction interceptor. Posts without a crew placement are global.
 * Access: User
 */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  /**
   * Lists posts visible to the authenticated user.
   *
   * @remarks Route: GET /api/social/posts
   * Access: User
   *
   * @returns Global posts and crew posts made visible by RLS.
   */
  @Get()
  async list(@CurrentUser() user: AuthenticatedUser): Promise<ListPostsResponse> {
    return this.service.listPostsData(user.id);
  }

  /**
   * Gets a visible post by its UUID.
   *
   * @remarks Route: GET /api/social/posts/:id
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns The requested post and its optional crew placement.
   * @throws NotFoundException when no visible post has the supplied UUID.
   */
  @Get(':id')
  async get(
    @RequestData(new ValidateRequestPipe(getPostRequestSchema))
    data: {
      params: GetPostParams;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetPostResponse> {
    return this.service.getPostData(data.params.id, user.id);
  }

  /**
   * Creates either a global post or a post placed in a crew.
   *
   * @remarks Route: POST /api/social/posts
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
    await this.service.createPostData(user.id, data.body);
  }

  /**
   * Updates the content of a post authored by the caller.
   *
   * @remarks Route: PATCH /api/social/posts/:id
   * Access: User
   *
   * @param data - The validated route parameters and update body.
   * @returns No response body with a 204 No Content status.
   * @throws NotFoundException when RLS exposes no matching post.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @RequestData(new ValidateRequestPipe(updatePostRequestSchema))
    data: {
      params: UpdatePostParams;
      body: UpdatePostBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UpdatePostResponse> {
    await this.service.updatePostData(data.params.id, user.id, data.body);
  }

  /**
   * Deletes a post authored by the caller.
   *
   * @remarks Route: DELETE /api/social/posts/:id
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns No response body.
   * @throws NotFoundException when RLS exposes no matching post.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @RequestData(new ValidateRequestPipe(deletePostRequestSchema))
    data: {
      params: DeletePostParams;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.service.deletePostData(data.params.id, user.id);
  }
}
