import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { MessagesRepository } from './application/ports/messages.repository';
import { DeleteMessageUseCase } from './application/commands/delete-message.use-case';
import { ListMessagesUseCase } from './application/queries/list-messages.use-case';
import { MarkMessageAsReadUseCase } from './application/commands/mark-message-as-read.use-case';
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
    ListMessagesUseCase,
    MarkMessageAsReadUseCase,
    DeleteMessageUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class MessagesInboxModule {}
