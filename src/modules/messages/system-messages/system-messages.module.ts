import { Module } from '@nestjs/common';
import { MessagePublisher } from './application/ports/message-publisher.port';
import { SystemMessagesRepository } from './application/ports/system-messages.repository';
import { SystemMessagesQueries } from './application/ports/system-messages.queries';
import { SendSystemMessageHandler } from './application/commands/send-system-message/send-system-message.handler';
import { SendWelcomeSystemMessageHandler } from './application/commands/send-welcome-system-message/send-welcome-system-message.handler';
import { SendWorkoutCompleteSystemMessageHandler } from './application/commands/send-workout-complete-system-message/send-workout-complete-system-message.handler';
import { PostgresSystemMessagesRepository } from './infrastructure/persistence/postgres-system-messages.repository';
import { SocketMessagePublisher } from './infrastructure/socket-message.publisher';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { FindDeliveredByIdSql } from './infrastructure/persistence/reads/find-delivered-by-id.sql';
import { PostgresSystemMessagesQueries } from './infrastructure/persistence/postgres-system-messages.queries';
import { UserFirstLoginListener } from './user-first-login.listener';

/** Composes system-message creation, delivery, and event handling. */
@Module({
  providers: [
    CreateSql,
    FindDeliveredByIdSql,
    { provide: SystemMessagesQueries, useClass: PostgresSystemMessagesQueries },
    { provide: SystemMessagesRepository, useClass: PostgresSystemMessagesRepository },
    { provide: MessagePublisher, useClass: SocketMessagePublisher },
    SendSystemMessageHandler,
    SendWelcomeSystemMessageHandler,
    SendWorkoutCompleteSystemMessageHandler,
    UserFirstLoginListener,
  ],
})
export class SystemMessagesModule {}
