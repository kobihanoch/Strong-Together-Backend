import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { MessagesRepository } from './application/ports/messages.repository';
import { DeleteMessageHandler } from './application/commands/delete-message/delete-message.handler';
import { ListMessagesHandler } from './application/queries/list-messages/list-messages.handler';
import { MarkMessageAsReadHandler } from './application/commands/mark-message-as-read/mark-message-as-read.handler';
import { FindByUserSql } from './infrastructure/persistence/reads/find-by-user.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { FindByIdForUpdateSql } from './infrastructure/persistence/reads/find-by-id-for-update.sql';
import { PostgresMessagesRepository } from './infrastructure/persistence/postgres-messages.repository';
import { MessagesController } from './presentation/messages.controller';
import { MessagesQueries } from './application/ports/messages.queries';
import { PostgresMessagesQueries } from './infrastructure/persistence/postgres-messages.queries';

/** Composes the message inbox capability and its adapters. */
@Module({
  controllers: [MessagesController],
  providers: [
    { provide: MessagesQueries, useClass: PostgresMessagesQueries },
    FindByUserSql,
    FindByIdForUpdateSql,
    SaveSql,
    DeleteSql,
    { provide: MessagesRepository, useClass: PostgresMessagesRepository },
    ListMessagesHandler,
    MarkMessageAsReadHandler,
    DeleteMessageHandler,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class MessagesInboxModule {}
