import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_FIRST_LOGIN_EVENT, UserFirstLoginEvent } from '../../../../common/application/events/user-first-login.event';
import { AuthenticationEvents } from '../application/ports/authentication-events.port';

/** Nest event-emitter adapter for session lifecycle events. */
@Injectable()
export class NestAuthenticationEvents implements AuthenticationEvents {
  constructor(private readonly events: EventEmitter2) {}

  async userFirstLogin(userId: string, userName: string): Promise<void> {
    await this.events.emitAsync(USER_FIRST_LOGIN_EVENT, new UserFirstLoginEvent(userId, userName));
  }
}
