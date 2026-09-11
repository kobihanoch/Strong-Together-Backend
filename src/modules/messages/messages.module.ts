import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { MessagesController } from './messages.controller';
import { MessagesQueries } from './messages.queries';
import { MessagesService } from './messages.service';
import { SystemMessagesService } from './system-messages/system-messages.service';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesQueries,
    MessagesService,
    SystemMessagesService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [MessagesService, SystemMessagesService],
})
export class MessagesModule {}
