import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WebSocketTicketIssuer } from './application/ports/web-socket-ticket-issuer.port';
import { CreateWebSocketTicketHandler } from './application/commands/create-web-socket-ticket/create-web-socket-ticket.handler';
import { JwtWebSocketTicketIssuer } from './infrastructure/jwt-web-socket-ticket.issuer';
import { WebSocketsController } from './presentation/web-sockets.controller';

@Module({
  controllers: [WebSocketsController],
  providers: [
    { provide: WebSocketTicketIssuer, useClass: JwtWebSocketTicketIssuer },
    CreateWebSocketTicketHandler,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class WebSocketsModule {}
