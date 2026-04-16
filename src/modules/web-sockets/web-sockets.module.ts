import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';
import { WebSocketsController } from './web-sockets.controller.ts';
import { WebSocketsService } from './web-sockets.service.ts';

@Module({
  controllers: [WebSocketsController],
  providers: [WebSocketsService, SessionQueries, DpopGuard, AuthenticationGuard, AuthorizationGuard],
})
export class WebSocketsModule {}
