import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { MessagesRepository } from './application/ports/messages.repository';
import { DeleteMessageUseCase } from './application/use-cases/delete-message.use-case';
import { ListMessagesUseCase } from './application/use-cases/list-messages.use-case';
import { MarkMessageAsReadUseCase } from './application/use-cases/mark-message-as-read.use-case';
import { MessagesSql } from './infrastructure/messages.sql';
import { PostgresMessagesRepository } from './infrastructure/postgres-messages.repository';
import { MessagesController } from './presentation/messages.controller';

/** Composes the message inbox capability and its adapters. */
@Module({
  controllers: [MessagesController],
  providers: [
    MessagesSql,
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
