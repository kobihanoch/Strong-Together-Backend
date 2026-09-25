import { Module } from '@nestjs/common';
import { MessagePublisher } from './application/ports/message-publisher.port';
import { SystemMessagesRepository } from './application/ports/system-messages.repository';
import { SendSystemMessageUseCase } from './application/commands/send-system-message.use-case';
import { SendWelcomeSystemMessageUseCase } from './application/commands/send-welcome-system-message.use-case';
import { SendWorkoutCompleteSystemMessageUseCase } from './application/commands/send-workout-complete-system-message.use-case';
import { PostgresSystemMessagesRepository } from './infrastructure/persistence/postgres-system-messages.repository';
import { SocketMessagePublisher } from './infrastructure/socket-message.publisher';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { UserFirstLoginListener } from './user-first-login.listener';

/** Composes system-message creation, delivery, and event handling. */
@Module({
  providers: [
    CreateSql,
    { provide: SystemMessagesRepository, useClass: PostgresSystemMessagesRepository },
    { provide: MessagePublisher, useClass: SocketMessagePublisher },
    SendSystemMessageUseCase,
    SendWelcomeSystemMessageUseCase,
    SendWorkoutCompleteSystemMessageUseCase,
    UserFirstLoginListener,
  ],
})
export class SystemMessagesModule {}
