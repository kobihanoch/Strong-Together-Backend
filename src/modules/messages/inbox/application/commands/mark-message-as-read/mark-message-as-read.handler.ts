import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { MessageNotFoundError } from '../../../../domain/errors/message.errors';
import { MessagesRepository } from '../../ports/messages.repository';
import { MarkMessageAsReadCommand } from './mark-message-as-read.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Marks inbox messages as read for their receiving user. */
@CommandHandler(MarkMessageAsReadCommand)
export class MarkMessageAsReadHandler implements ICommandHandler<MarkMessageAsReadCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: MessagesRepository,
  ) {}

  /**
   * Marks a message as read when it belongs to the user.
   *
   * @param messageId - The message to update.
   * @param userId - The receiving user.
   * @returns Nothing when the update succeeds.
   * @throws {MessageNotFoundError} When the user cannot access the message.
   */
  async execute(command: MarkMessageAsReadCommand): Promise<void> {
    const { messageId, userId } = command;
    return this.unitOfWork.execute(userId, async () => {
      const message = await this.repository.findByIdForUpdate(messageId);
      if (!message) throw new MessageNotFoundError();
      message.markAsRead(userId);
      await this.repository.save(message);
    });
  }
}
