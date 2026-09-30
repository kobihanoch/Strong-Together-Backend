import { CommandBus } from '@nestjs/cqrs';
import { getEndOfWorkoutMessage } from '../../../domain/system-message.templates';
import { SendSystemMessageCommand } from '../send-system-message/send-system-message.command';
import { SendWorkoutCompleteSystemMessageCommand } from './send-workout-complete-system-message.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Sends the standard message after a user completes a workout. */
@CommandHandler(SendWorkoutCompleteSystemMessageCommand)
export class SendWorkoutCompleteSystemMessageHandler implements ICommandHandler<SendWorkoutCompleteSystemMessageCommand> {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Sends the workout-completion message to a user.
   *
   * @param receiverId - The recipient user.
   * @returns The persisted delivery message.
   */
  execute(command: SendWorkoutCompleteSystemMessageCommand) {
    const { receiverId } = command;
    return this.commandBus.execute(new SendSystemMessageCommand(receiverId, getEndOfWorkoutMessage()));
  }
}
