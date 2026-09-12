import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { addCommentRequestSchema, deleteCommentRequestSchema, editCommentRequestSchema, listPostCommentsRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { CommentsService } from './comments.service';

/**
 * Exposes authenticated comment writes for social posts.
 *
 * @remarks Every route uses DPoP authentication, user authorization, request
 * validation, and the RLS transaction interceptor. Access: User.
 */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class CommentsController {
  /**
   * Creates the comment controller.
   *
   * @param service - The comment application service.
   */
  public constructor(private readonly service: CommentsService) {}

  /**
   * Lists comments on a post visible to the caller.
   *
   * @remarks Route: GET /api/social/posts/:postId/comments. Access: User.
   * @param data - The validated post identifier and cursor pagination.
   * @returns Comments in oldest-first conversation order.
   */
  @Get(':postId/comments')
  public listComments(
    @RequestData(new ValidateRequestPipe(listPostCommentsRequestSchema))
    data: { params: ListPostCommentsParams; query: ListPostCommentsQuery },
  ): Promise<ListPostCommentsResponse> {
    return this.service.listPostComments(data.params.postId, data.query.limit, data.query.cursor);
  }

  /**
   * Adds a comment to a visible post.
   *
   * @remarks Route: POST /api/social/posts/:postId/comments. Access: User.
   * @param data - The validated post identifier and comment content.
   * @param user - The authenticated comment author.
   * @returns No response body with a 201 Created status.
   */
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  public async addComment(
    @RequestData(new ValidateRequestPipe(addCommentRequestSchema)) data: { params: AddCommentParams; body: AddCommentBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AddCommentResponse> {
    await this.service.addComment(data.params.postId, user.id, data.body);
  }

  /**
   * Edits a comment authored by the caller.
   *
   * @remarks Route: PATCH /api/social/posts/comments/:id. Access: User.
   * @param data - The validated comment identifier and replacement content.
   * @returns No response body with a 204 No Content status.
   */
  @Patch('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async editComment(
    @RequestData(new ValidateRequestPipe(editCommentRequestSchema)) data: { params: EditCommentParams; body: EditCommentBody },
  ): Promise<EditCommentResponse> {
    await this.service.editComment(data.params.id, data.body);
  }

  /**
   * Deletes a comment authored by the caller.
   *
   * @remarks Route: DELETE /api/social/posts/comments/:id. Access: User.
   * @param data - The validated comment identifier.
   * @returns No response body with a 204 No Content status.
   */
  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @RequestData(new ValidateRequestPipe(deleteCommentRequestSchema)) data: { params: DeleteCommentParams },
  ): Promise<DeleteCommentResponse> {
    await this.service.deleteComment(data.params.id);
  }
}
