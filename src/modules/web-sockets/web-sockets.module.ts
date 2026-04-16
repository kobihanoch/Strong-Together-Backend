import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { WebSocketsController } from './web-sockets.controller.ts';
import { WebSocketsService } from './web-sockets.service.ts';

@Module({
  imports: [AuthGuardsModule],
  controllers: [WebSocketsController],
  providers: [WebSocketsService, DpopGuard],
})
export class WebSocketsModule {}
