import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WebSocketsController } from './web-sockets.controller';
import { WebSocketsService } from './web-sockets.service';

@Module({
  controllers: [WebSocketsController],
  providers: [WebSocketsService, DpopGuard, AuthenticationGuard, AuthorizationGuard],
})
export class WebSocketsModule {}
