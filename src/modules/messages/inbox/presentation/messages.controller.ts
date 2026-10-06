import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import type { DeleteMessageParams, ListMessagesQuery as ListMessagesRequestQuery, ListMessagesResponse, MarkMessageAsReadParams } from '@strong-together/shared';
import { deleteMessageRequestSchema, listMessagesRequestSchema, markMessageAsReadRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { DeleteMessageCommand } from '../application/commands/delete-message/delete-message.command';
import { ListMessagesQuery } from '../application/queries/list-messages/list-messages.query';
import { MarkMessageAsReadCommand } from '../application/commands/mark-message-as-read/mark-message-as-read.command';

/** E */
@Controller('api/messages')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class MessagesController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Retrieves the authenticated user's inbox.
   *
   * API: `GET /api/messages`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated time-zone query.
   * @param user - The authenticated request user.
   * @returns The user's messages.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  async list(
    @RequestData(new ValidateRequestPipe(listMessagesRequestSchema)) data: { query: ListMessagesRequestQuery },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListMessagesResponse> {
    return this.queryBus.execute(new ListMessagesQuery(user.id, data.query.tz));
  }

  /**
   * Marks an owned message as read.
   *
   * API: `PATCH /api/messages/:id/read`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated message identifier.
   * @param user - The authenticated request user.
   * @returns Nothing.
   * @throws {MessageNotFoundError} When the message is absent or not owned by the user.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markRead(
    @RequestData(new ValidateRequestPipe(markMessageAsReadRequestSchema)) data: { params: MarkMessageAsReadParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.commandBus.execute(new MarkMessageAsReadCommand(data.params.id, user.id));
  }

  /**
   * Deletes a message visible to the authenticated user.
   *
   * API: `DELETE /api/messages/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated message identifier.
   * @param user - The authenticated request user.
   * @returns Nothing.
   * @throws {MessageNotFoundError} When the message is absent or inaccessible to the user.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @RequestData(new ValidateRequestPipe(deleteMessageRequestSchema)) data: { params: DeleteMessageParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteMessageCommand(data.params.id, user.id));
  }
}
