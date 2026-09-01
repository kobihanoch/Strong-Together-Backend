import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { CreateWebSocketTicketBody, CreateWebSocketTicketResponse } from '@strong-together/shared';
import { createWebSocketTicketRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../common/types/express';
import { WebSocketsService } from './web-sockets.service';

/**
 * WebSocket helper routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/websocket-tickets
 *
 * Access: User
 */
@Controller('api/websocket-tickets')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class WebSocketsController {
  constructor(private readonly webSocketsService: WebSocketsService) {}

  /**
   * Generate a signed WebSocket connection ticket for the authenticated user.
   *
   * Returns a short-lived signed token that the client can use to establish a
   * Socket.IO session.
   *
   * @remarks Route: POST /api/websocket-tickets
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Post()
  async createWebSocketTicket(
    @RequestData(new ValidateRequestPipe(createWebSocketTicketRequestSchema))
    data: { body: CreateWebSocketTicketBody },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateWebSocketTicketResponse> {
    const payload = await this.webSocketsService.createWebSocketTicketData(user.id, data.body.username);
    res.status(201);
    return payload;
  }
}
