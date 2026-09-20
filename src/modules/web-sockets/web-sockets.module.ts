import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WebSocketTicketIssuer } from './application/ports/web-socket-ticket-issuer.port';
import { CreateWebSocketTicketUseCase } from './application/use-cases/create-web-socket-ticket.use-case';
import { JwtWebSocketTicketIssuer } from './infrastructure/jwt-web-socket-ticket.issuer';
import { WebSocketsController } from './presentation/web-sockets.controller';

@Module({
  controllers: [WebSocketsController],
  providers: [
    { provide: WebSocketTicketIssuer, useClass: JwtWebSocketTicketIssuer },
    CreateWebSocketTicketUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class WebSocketsModule {}
