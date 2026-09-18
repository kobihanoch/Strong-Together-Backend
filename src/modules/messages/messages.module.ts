import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { MessagesController } from './messages.controller';
import { MessagesQueries } from './messages.queries';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { PostgresMessagesRepository } from './postgres-messages.repository';
import { PostgresSystemMessagesRepository } from './system-messages/postgres-system-messages.repository';
import { SystemMessagesQueries } from './system-messages/system-messages.queries';
import { SystemMessagesRepository } from './system-messages/system-messages.repository';
import { SystemMessagesService } from './system-messages/system-messages.service';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesQueries,
    {
      provide: MessagesRepository,
      useClass: PostgresMessagesRepository,
    },
    SystemMessagesQueries,
    {
      provide: SystemMessagesRepository,
      useClass: PostgresSystemMessagesRepository,
    },
    MessagesService,
    SystemMessagesService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
  exports: [MessagesService, SystemMessagesService],
})
export class MessagesModule {}
