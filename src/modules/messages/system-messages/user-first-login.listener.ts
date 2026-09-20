import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_FIRST_LOGIN_EVENT, UserFirstLoginEvent } from '../../../common/application/events/user-first-login.event';
import { SystemMessagesService } from './system-messages.service';

/** Handles first-login events by creating the user's welcome system message. */
@Injectable()
export class UserFirstLoginListener {
  constructor(private readonly systemMessages: SystemMessagesService) {}

  @OnEvent(USER_FIRST_LOGIN_EVENT)
  async handle(event: UserFirstLoginEvent): Promise<void> {
    await this.systemMessages.sendSystemMessageToUserWhenFirstLogin(event.userId, event.userName);
  }
}
