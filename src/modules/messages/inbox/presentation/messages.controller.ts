import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import type { DeleteMessageParams, ListMessagesQuery, ListMessagesResponse, MarkMessageAsReadParams } from '@strong-together/shared';
import { deleteMessageRequestSchema, listMessagesRequestSchema, markMessageAsReadRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { DeleteMessageUseCase } from '../application/use-cases/delete-message.use-case';
import { ListMessagesUseCase } from '../application/use-cases/list-messages.use-case';
import { MarkMessageAsReadUseCase } from '../application/use-cases/mark-message-as-read.use-case';

/** E */
@Controller('api/messages')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class MessagesController {
  constructor(
    private readonly listMessages: ListMessagesUseCase,
    private readonly markAsRead: MarkMessageAsReadUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
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
    @RequestData(new ValidateRequestPipe(listMessagesRequestSchema)) data: { query: ListMessagesQuery },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListMessagesResponse> {
    return this.listMessages.execute(user.id, data.query.tz);
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
    await this.markAsRead.execute(data.params.id, user.id);
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
    await this.deleteMessageUseCase.execute(data.params.id, user.id);
  }
}
