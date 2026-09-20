import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_FIRST_LOGIN_EVENT, UserFirstLoginEvent } from '../../../common/application/events/user-first-login.event';
import { SendWelcomeSystemMessageUseCase } from './application/use-cases/send-welcome-system-message.use-case';

/** Handles first-login events by creating the user's welcome system message. */
@Injectable()
export class UserFirstLoginListener {
  constructor(private readonly sendWelcomeMessage: SendWelcomeSystemMessageUseCase) {}

  @OnEvent(USER_FIRST_LOGIN_EVENT)
  async handle(event: UserFirstLoginEvent): Promise<void> {
    await this.sendWelcomeMessage.execute(event.userId, event.userName);
  }
}
