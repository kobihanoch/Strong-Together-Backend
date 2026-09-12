import { Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  DeleteReactionParams,
  DeleteReactionResponse,
  ListPostReactionsParams,
  ListPostReactionsQuery,
  ListPostReactionsResponse,
  ReactToPostBody,
  ReactToPostParams,
  ReactToPostResponse,
} from '@strong-together/shared';
import { deleteReactionRequestSchema, listPostReactionsRequestSchema, reactToPostRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { ReactionsService } from './reactions.service';

/**
 * Exposes authenticated reaction writes for social posts.
 *
 * @remarks Every route uses DPoP authentication, user authorization, request
 * validation, and the RLS transaction interceptor. Access: User.
 */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class ReactionsController {
  /**
   * Creates the reaction controller.
   *
   * @param service - The reaction application service.
   */
  public constructor(private readonly service: ReactionsService) {}

  /**
   * Lists reactions on a post visible to the caller.
   *
   * @remarks Route: GET /api/social/posts/:postId/reactions. Access: User.
   * @param data - The validated post identifier and cursor pagination.
   * @returns Reactions ordered from newest to oldest.
   */
  @Get(':postId/reactions')
  public listReactions(
    @RequestData(new ValidateRequestPipe(listPostReactionsRequestSchema))
    data: { params: ListPostReactionsParams; query: ListPostReactionsQuery },
  ): Promise<ListPostReactionsResponse> {
    return this.service.listPostReactions(data.params.postId, data.query.limit, data.query.cursor);
  }

  /**
   * Creates or replaces the caller's reaction to a post.
   *
   * @remarks Route: POST /api/social/posts/:postId/reactions. Access: User.
   * @param data - The validated post identifier and reaction type.
   * @param user - The authenticated caller.
   * @returns No response body with a 201 Created status.
   */
  @Post(':postId/reactions')
  @HttpCode(HttpStatus.CREATED)
  public async react(
    @RequestData(new ValidateRequestPipe(reactToPostRequestSchema)) data: { params: ReactToPostParams; body: ReactToPostBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReactToPostResponse> {
    await this.service.react(data.params.postId, user.id, data.body);
  }

  /**
   * Deletes the caller's reaction from a post.
   *
   * @remarks Route: DELETE /api/social/posts/:postId/reactions. Access: User.
   * @param data - The validated post identifier.
   * @param user - The authenticated caller.
   * @returns No response body with a 204 No Content status.
   */
  @Delete(':postId/reactions')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteReaction(
    @RequestData(new ValidateRequestPipe(deleteReactionRequestSchema)) data: { params: DeleteReactionParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteReactionResponse> {
    await this.service.deleteReaction(data.params.postId, user.id);
  }
}
