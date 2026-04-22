import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { MessagesController } from './messages.controller';
import { MessagesQueries } from './messages.queries';
import { MessagesService } from './messages.service';
import { SystemMessagesService } from './system-messages/system-messages.service';

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
