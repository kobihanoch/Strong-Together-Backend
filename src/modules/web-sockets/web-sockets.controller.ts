import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { GenerateTicketBody, GenerateTicketResponse } from '@strong-together/shared';
import { generateTicketRequest } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../common/decorators/request-data.decorator.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe.ts';
import type { AuthenticatedUser } from '../../common/types/express.js';
import { WebSocketsService } from './web-sockets.service.ts';

/**
 * WebSocket helper routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/ws/generateticket
 *
 * Access: User
 */
@Controller('api/ws')
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
   * Route: POST /api/ws/generateticket
   * Access: User
   */
  @Post('generateticket')
  async generateTicket(
    @RequestData(new ValidateRequestPipe(generateTicketRequest))
    data: { body: GenerateTicketBody },
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GenerateTicketResponse> {
    const payload = await this.webSocketsService.generateTicketData(user.id, data.body.username);
    res.status(201);
    return payload;
  }
}
