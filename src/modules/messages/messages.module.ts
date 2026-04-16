import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesController } from './messages.controller.ts';
import { MessagesQueries } from './messages.queries.ts';
import { MessagesService } from './messages.service.ts';
import { SystemMessagesService } from './system-messages/system-messages.service.ts';

@Module({
  imports: [AuthGuardsModule],
  controllers: [MessagesController],
  providers: [
    MessagesQueries,
    MessagesService,
    SystemMessagesService,
    DpopGuard,
    RlsTxInterceptor,
  ],
  exports: [MessagesService, SystemMessagesService],
})
export class MessagesModule {}
