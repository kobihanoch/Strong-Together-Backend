import { CommandBus } from '@nestjs/cqrs';
import { getFirstLoginMessage } from '../../../domain/system-message.templates';
import { SendSystemMessageCommand } from '../send-system-message/send-system-message.command';
import { SendWelcomeSystemMessageCommand } from './send-welcome-system-message.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Sends the standard welcome message after a user's first login. */
@CommandHandler(SendWelcomeSystemMessageCommand)
export class SendWelcomeSystemMessageHandler implements ICommandHandler<SendWelcomeSystemMessageCommand> {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Sends the first-login welcome message to a user.
   *
   * @param receiverId - The recipient user.
   * @param receiverName - The recipient's display name.
   * @returns The persisted delivery message.
   */
  execute(command: SendWelcomeSystemMessageCommand) {
    const { receiverId, receiverName } = command;
    return this.commandBus.execute(new SendSystemMessageCommand(receiverId, getFirstLoginMessage(receiverName)));
  }
}
