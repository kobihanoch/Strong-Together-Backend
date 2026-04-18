import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { WebSocketsController } from './web-sockets.controller';
import { WebSocketsService } from './web-sockets.service';

@Module({
  imports: [AuthGuardsModule],
  controllers: [WebSocketsController],
  providers: [WebSocketsService, DpopGuard],
})
export class WebSocketsModule {}
