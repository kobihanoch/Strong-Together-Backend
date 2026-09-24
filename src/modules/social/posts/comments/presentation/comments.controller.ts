import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import type {
  AddCommentBody,
  AddCommentParams,
  AddCommentResponse,
  DeleteCommentParams,
  DeleteCommentResponse,
  EditCommentBody,
  EditCommentParams,
  EditCommentResponse,
  ListPostCommentsParams,
  ListPostCommentsQuery,
  ListPostCommentsResponse,
} from '@strong-together/shared';
import {
  addCommentRequestSchema,
  deleteCommentRequestSchema,
  editCommentRequestSchema,
  listPostCommentsRequestSchema,
} from '@strong-together/shared';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../../common/types/express';
import { AddCommentUseCase } from '../application/use-cases/add-comment.use-case';
import { DeleteCommentUseCase } from '../application/use-cases/delete-comment.use-case';
import { EditCommentUseCase } from '../application/use-cases/edit-comment.use-case';
import { ListPostCommentsUseCase } from '../application/use-cases/list-post-comments.use-case';

/** Exposes authenticated comment writes for social posts. */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class CommentsController {
  /**
   * Creates the comment controller.
   *
   * @param service - The comment application service.
   */
  public constructor(
    private readonly listPostComments: ListPostCommentsUseCase,
    private readonly addPostComment: AddCommentUseCase,
    private readonly editPostComment: EditCommentUseCase,
    private readonly deletePostComment: DeleteCommentUseCase,
  ) {}

  /**
   * Lists comments on a post visible to the caller.
   *
   * API: `GET /api/social/posts/:postId/comments`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated post identifier and cursor pagination.
   * @returns Comments in oldest-first conversation order.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get(':postId/comments')
  public listComments(
    @RequestData(new ValidateRequestPipe(listPostCommentsRequestSchema))
    data: {
      params: ListPostCommentsParams;
      query: ListPostCommentsQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListPostCommentsResponse> {
    return this.listPostComments.execute(user.id, data.params.postId, data.query.limit, data.query.cursor);
  }

  /**
   * Adds a comment to a visible post.
   *
   * API: `POST /api/social/posts/:postId/comments`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated post identifier and comment content.
   * @param user - The authenticated comment author.
   * @returns No response body with a 201 Created status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  public async addComment(
    @RequestData(new ValidateRequestPipe(addCommentRequestSchema)) data: { params: AddCommentParams; body: AddCommentBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AddCommentResponse> {
    await this.addPostComment.execute(data.params.postId, user.id, data.body.content);
  }

  /**
   * Edits a comment authored by the caller.
   *
   * API: `PATCH /api/social/posts/comments/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated comment identifier and replacement content.
   * @returns No response body with a 204 No Content status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Patch('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async editComment(
    @RequestData(new ValidateRequestPipe(editCommentRequestSchema)) data: { params: EditCommentParams; body: EditCommentBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EditCommentResponse> {
    await this.editPostComment.execute(user.id, data.params.id, data.body.content);
  }

  /**
   * Deletes a comment authored by the caller.
   *
   * API: `DELETE /api/social/posts/comments/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated comment identifier.
   * @returns No response body with a 204 No Content status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @RequestData(new ValidateRequestPipe(deleteCommentRequestSchema)) data: { params: DeleteCommentParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteCommentResponse> {
    await this.deletePostComment.execute(user.id, data.params.id);
  }
}
