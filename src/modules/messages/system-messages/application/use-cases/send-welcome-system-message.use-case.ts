import { Injectable } from '@nestjs/common';
import { getFirstLoginMessage } from '../../domain/system-message.templates';
import { SendSystemMessageUseCase } from './send-system-message.use-case';

/** Sends the standard welcome message after a user's first login. */
@Injectable()
export class SendWelcomeSystemMessageUseCase {
  constructor(private readonly sendSystemMessage: SendSystemMessageUseCase) {}

  /**
   * Sends the first-login welcome message to a user.
   *
   * @param receiverId - The recipient user.
   * @param receiverName - The recipient's display name.
   * @returns The persisted delivery message.
   */
  execute(receiverId: string, receiverName: string) {
    return this.sendSystemMessage.execute(receiverId, getFirstLoginMessage(receiverName));
  }
}
