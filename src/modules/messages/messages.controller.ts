import { Controller, Delete, Get, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  DeleteMessageParams,
  DeleteMessageResponse,
  GetAllUserMessagesQuery,
  GetAllUserMessagesResponse,
  MarkMessageAsReadParams,
  MarkMessageAsReadResponse,
} from '@strong-together/shared';
import { deleteMessageRequest, getAllMessagesRequest, markMessageAsReadRequest } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../common/decorators/request-data.decorator.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe.ts';
import type { AuthenticatedUser } from '../../common/types/express.ts';
import { MessagesService } from './messages.service.ts';

/**
 * Message routes for authenticated users.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/messages/getmessages
 * - PUT /api/messages/markasread/:id
 * - DELETE /api/messages/delete/:id
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
   * Route: GET /api/messages/getmessages
   * Access: User
   */
  @Get('getmessages')
  async getAllUserMessages(
    @RequestData(new ValidateRequestPipe(getAllMessagesRequest))
    data: { query: GetAllUserMessagesQuery },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetAllUserMessagesResponse> {
    const tz = data.query.tz;
    // Get messages
    const { payload } = await this.messagesService.getAllMessagesData(user.id, tz);
    return payload;
  }

  // -----------------------------------

  /**
   * Mark a message as read for the authenticated user.
   *
   * Updates the target message only when it belongs to the current user and
   * returns the updated read state.
   *
   * Route: PUT /api/messages/markasread/:id
   * Access: User
   */
  @Put('markasread/:id')
  async markUserMessageAsRead(
    @RequestData(new ValidateRequestPipe(markMessageAsReadRequest))
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
   * Route: DELETE /api/messages/delete/:id
   * Access: User
   */
  @Delete('delete/:id')
  async deleteMessage(
    @RequestData(new ValidateRequestPipe(deleteMessageRequest))
    data: { params: DeleteMessageParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteMessageResponse> {
    const payload = await this.messagesService.deleteMessageData(data.params.id, user.id);
    return payload;
  }
}
