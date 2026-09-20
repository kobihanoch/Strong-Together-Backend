import { Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../../common/types/express';
import { DeleteReactionUseCase } from '../application/use-cases/delete-reaction.use-case';
import { ListPostReactionsUseCase } from '../application/use-cases/list-post-reactions.use-case';
import { ReactToPostUseCase } from '../application/use-cases/react-to-post.use-case';

/**
 * Exposes authenticated reaction writes for social posts.
 *
 * @remarks Every route uses DPoP authentication, user authorization, request
 * validation, and the RLS transaction interceptor. Access: User.
 */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class ReactionsController {
  /**
   * Creates the reaction controller.
   *
   * @param service - The reaction application service.
   */
  public constructor(
    private readonly listPostReactions: ListPostReactionsUseCase,
    private readonly reactToPost: ReactToPostUseCase,
    private readonly deletePostReaction: DeleteReactionUseCase,
  ) {}

  /**
   * Lists reactions on a post visible to the caller.
   *
   * API: GET /api/social/posts/:postId/reactions
   * Access: Authenticated user
   * @param data - The validated post identifier and cursor pagination.
   * @returns Reactions ordered from newest to oldest.
   */
  @Get(':postId/reactions')
  public listReactions(
    @RequestData(new ValidateRequestPipe(listPostReactionsRequestSchema))
    data: {
      params: ListPostReactionsParams;
      query: ListPostReactionsQuery;
    },
  ): Promise<ListPostReactionsResponse> {
    return this.listPostReactions.execute(data.params.postId, data.query.limit, data.query.cursor);
  }

  /**
   * Creates or replaces the caller's reaction to a post.
   *
   * API: POST /api/social/posts/:postId/reactions
   * Access: Authenticated user
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
    await this.reactToPost.execute(data.params.postId, user.id, data.body.type);
  }

  /**
   * Deletes the caller's reaction from a post.
   *
   * API: DELETE /api/social/posts/:postId/reactions
   * Access: Authenticated user
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
    await this.deletePostReaction.execute(data.params.postId, user.id);
  }
}
