import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_REGISTERED_EVENT, UserRegisteredEvent } from '../../../common/application/events/user-registered.event';
import { VerificationEmailSender } from './application/ports/verification-email-sender.port';

/** Handles user-registration events by sending the initial verification email. */
@Injectable()
export class UserRegisteredListener {
  constructor(private readonly emailSender: VerificationEmailSender) {}

  @OnEvent(USER_REGISTERED_EVENT)
  async handle(event: UserRegisteredEvent): Promise<void> {
    await this.emailSender.send(event.email, event.userId, event.fullName, event.requestId ? { requestId: event.requestId } : {});
  }
}
