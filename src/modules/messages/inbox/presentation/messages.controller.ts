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

/** Exposes authenticated message inbox endpoints. */
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
   * API: GET /api/messages
   * Access: Authenticated user
   *
   * @param data - The validated time-zone query.
   * @param user - The authenticated request user.
   * @returns The user's messages.
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
   * API: PATCH /api/messages/:id/read
   * Access: Authenticated user
   *
   * @param data - The validated message identifier.
   * @param user - The authenticated request user.
   * @returns Nothing.
   * @throws {MessageNotFoundError} When the message is absent or not owned by the user.
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
   * API: DELETE /api/messages/:id
   * Access: Authenticated user
   *
   * @param data - The validated message identifier.
   * @param user - The authenticated request user.
   * @returns Nothing.
   * @throws {MessageNotFoundError} When the message is absent or inaccessible to the user.
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
