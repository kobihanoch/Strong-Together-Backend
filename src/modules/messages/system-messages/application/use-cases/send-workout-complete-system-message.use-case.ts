import { Injectable } from '@nestjs/common';
import { getEndOfWorkoutMessage } from '../../domain/system-message.templates';
import { SendSystemMessageUseCase } from './send-system-message.use-case';

/** Sends the standard message after a user completes a workout. */
@Injectable()
export class SendWorkoutCompleteSystemMessageUseCase {
  constructor(private readonly sendSystemMessage: SendSystemMessageUseCase) {}

  /**
   * Sends the workout-completion message to a user.
   *
   * @param receiverId - The recipient user.
   * @returns The persisted delivery message.
   */
  execute(receiverId: string) {
    return this.sendSystemMessage.execute(receiverId, getEndOfWorkoutMessage());
  }
}
