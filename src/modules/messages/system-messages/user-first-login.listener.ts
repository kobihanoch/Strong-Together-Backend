import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_FIRST_LOGIN_EVENT, UserFirstLoginEvent } from '../../../common/application/events/user-first-login.event';
import { SendWelcomeSystemMessageCommand } from './application/commands/send-welcome-system-message/send-welcome-system-message.command';

/** Handles first-login events by creating the user's welcome system message. */
@Injectable()
export class UserFirstLoginListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(USER_FIRST_LOGIN_EVENT)
  async handle(event: UserFirstLoginEvent): Promise<void> {
    await this.commandBus.execute(new SendWelcomeSystemMessageCommand(event.userId, event.userName));
  }
}
