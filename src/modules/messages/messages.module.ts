import { Module } from '@nestjs/common';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesController } from './messages.controller.ts';
import { MessagesQueries } from './messages.queries.ts';
import { MessagesService } from './messages.service.ts';
import { SystemMessagesService } from './system-messages/system-messages.service.ts';
import { SessionQueries } from '../auth/session/session.queries.ts';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesQueries,
    MessagesService,
    SystemMessagesService,
    SessionQueries,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [MessagesService, SystemMessagesService],
})
export class MessagesModule {}
