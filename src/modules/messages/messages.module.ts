import { Module } from '@nestjs/common';
import { MessagesInboxModule } from './inbox/messages-inbox.module';
import { SystemMessagesModule } from './system-messages/system-messages.module';

/** Composes and re-exports the independent message capabilities. */
@Module({
  imports: [MessagesInboxModule, SystemMessagesModule],
  exports: [MessagesInboxModule, SystemMessagesModule],
})
export class MessagesModule {}
