import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_REGISTERED_EVENT, UserRegisteredEvent } from '../../../../common/application/events/user-registered.event';
import { UserRegistrationEvents } from '../application/ports/user-registration-events.port';

/** Nest event-emitter adapter for user-registration lifecycle events. */
@Injectable()
export class NestUserRegistrationEvents implements UserRegistrationEvents {
  constructor(private readonly publisher: EventEmitter2) {}

  async userRegistered(userId: string, email: string, fullName: string, requestId?: string): Promise<void> {
    await this.publisher.emitAsync(USER_REGISTERED_EVENT, new UserRegisteredEvent(userId, email, fullName, requestId));
  }
}
