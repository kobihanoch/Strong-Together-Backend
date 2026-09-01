import { Controller, Delete, Get, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  DeleteMessageParams,
  DeleteMessageResponse,
  ListMessagesQuery,
  ListMessagesResponse,
  MarkMessageAsReadParams,
  MarkMessageAsReadResponse,
} from '@strong-together/shared';
import { deleteMessageRequestSchema, listMessagesRequestSchema, markMessageAsReadRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../common/types/express';
import { MessagesService } from './messages.service';

/**
 * Message routes for authenticated users.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/messages
 * - PATCH /api/messages/:id/read
 * - DELETE /api/messages/:id
 *
 * Access: User
 */
@Controller('api/messages')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Get the authenticated user's message inbox.
   *
   * Returns all messages for the current user, localized to the requested
   * timezone.
   *
   * @remarks Route: GET /api/messages
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns The response payload.
   */
  @Get()
  async listMessages(
    @RequestData(new ValidateRequestPipe(listMessagesRequestSchema))
    data: { query: ListMessagesQuery },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListMessagesResponse> {
    const tz = data.query.tz;
    const { payload } = await this.messagesService.listMessagesData(user.id, tz);
    return payload;
  }
  /**
   * Mark a message as read for the authenticated user.
   *
   * Updates the target message only when it belongs to the current user and
   * returns the updated read state.
   *
   * @remarks Route: PATCH /api/messages/:id/read
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns The response payload.
   */
  @Patch(':id/read')
  async markUserMessageAsRead(
    @RequestData(new ValidateRequestPipe(markMessageAsReadRequestSchema))
    data: { params: MarkMessageAsReadParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MarkMessageAsReadResponse> {
    const payload = await this.messagesService.markUserMessageAsReadData(data.params.id, user.id);
    return payload;
  }

  /**
   * Delete a message visible to the authenticated user.
   *
   * Removes the target message when the current user is allowed to access it and
   * returns the deleted message identifier.
   *
   * @remarks Route: DELETE /api/messages/:id
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @returns The response payload.
   */
  @Delete(':id')
  async deleteMessage(
    @RequestData(new ValidateRequestPipe(deleteMessageRequestSchema))
    data: { params: DeleteMessageParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteMessageResponse> {
    const payload = await this.messagesService.deleteMessageData(data.params.id, user.id);
    return payload;
  }
}
