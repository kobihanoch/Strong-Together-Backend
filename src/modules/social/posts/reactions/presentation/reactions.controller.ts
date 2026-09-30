import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import type {
  DeleteReactionParams,
  DeleteReactionResponse,
  ListPostReactionsParams,
  ListPostReactionsQuery as ListPostReactionsRequestQuery,
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
import { DeleteReactionCommand } from '../application/commands/delete-reaction/delete-reaction.command';
import { ListPostReactionsQuery } from '../application/queries/list-post-reactions/list-post-reactions.query';
import { ReactToPostCommand } from '../application/commands/react-to-post/react-to-post.command';

/** Exposes authenticated reaction writes for social posts. */
@Controller('api/social/posts')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class ReactionsController {
  /**
   * Creates the reaction controller.
   *
   * @param service - The reaction application service.
   */
  public constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Lists reactions on a post visible to the caller.
   *
   * API: `GET /api/social/posts/:postId/reactions`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated post identifier and cursor pagination.
   * @returns Reactions ordered from newest to oldest.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get(':postId/reactions')
  public listReactions(
    @RequestData(new ValidateRequestPipe(listPostReactionsRequestSchema))
    data: {
      params: ListPostReactionsParams;
      query: ListPostReactionsRequestQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListPostReactionsResponse> {
    return this.queryBus.execute(new ListPostReactionsQuery(user.id, data.params.postId, data.query.limit, data.query.cursor));
  }

  /**
   * Creates or replaces the caller's reaction to a post.
   *
   * API: `POST /api/social/posts/:postId/reactions`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated post identifier and reaction type.
   * @param user - The authenticated caller.
   * @returns No response body with a 201 Created status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post(':postId/reactions')
  @HttpCode(HttpStatus.CREATED)
  public async react(
    @RequestData(new ValidateRequestPipe(reactToPostRequestSchema)) data: { params: ReactToPostParams; body: ReactToPostBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReactToPostResponse> {
    await this.commandBus.execute(new ReactToPostCommand(data.params.postId, user.id, data.body.type));
  }

  /**
   * Deletes the caller's reaction from a post.
   *
   * API: `DELETE /api/social/posts/:postId/reactions`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated post identifier.
   * @param user - The authenticated caller.
   * @returns No response body with a 204 No Content status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete(':postId/reactions')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteReaction(
    @RequestData(new ValidateRequestPipe(deleteReactionRequestSchema)) data: { params: DeleteReactionParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteReactionResponse> {
    await this.commandBus.execute(new DeleteReactionCommand(data.params.postId, user.id));
  }
}
