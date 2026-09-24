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

/** Exposes authenticated CRUD endpoints for social posts. */
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
   * API: `GET /api/social/posts`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated pagination query.
   * @returns Global posts and crew posts the caller is authorized to view.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  async getVisiblePosts(
    @RequestData(new ValidateRequestPipe(listVisiblePostsRequestSchema))
    data: {
      query: ListVisiblePostsQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListVisiblePostsResponse> {
    return this.listVisiblePosts.execute(user.id, data.query.limit, data.query.cursor);
  }

  /**
   * Lists posts shared in one crew when the caller belongs to that crew.
   *
   * API: `GET /api/social/posts/crew/:crewId`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated crew identifier and pagination query.
   * @returns Posts shared in the requested crew, ordered newest first.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('crew/:crewId')
  async getCrewPosts(
    @RequestData(new ValidateRequestPipe(listCrewPostsRequestSchema))
    data: {
      params: ListCrewPostsParams;
      query: ListCrewPostsQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListCrewPostsResponse> {
    return this.listCrewPosts.execute(user.id, data.params.crewId, data.query.limit, data.query.cursor);
  }

  /**
   * Creates a public or crew-only post and optionally shares it with multiple crews.
   *
   * API: `POST /api/social/posts`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated post creation body.
   * @param user - The authenticated user supplied by the authentication guard.
   * @returns No response body with a 201 Created status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
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
   * API: `PATCH /api/social/posts/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated route parameters and update body.
   * @returns No response body with a 204 No Content status.
   * @throws {PostNotFoundError} When RLS exposes no matching post.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
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
    await this.updatePost.execute(user.id, data.params.id, data.body.content);
  }

  /**
   * Deletes a post authored by the caller.
   *
   * API: `DELETE /api/social/posts/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated route parameters.
   * @returns No response body.
   * @throws {PostNotFoundError} When RLS exposes no matching post.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
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
    await this.deletePost.execute(user.id, data.params.id);
  }
}
