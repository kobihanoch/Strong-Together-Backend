import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { MessageNotFoundError } from '../../../../domain/errors/message.errors';
import { MessagesRepository } from '../../ports/messages.repository';
import { DeleteMessageCommand } from './delete-message.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Deletes messages visible to a requesting user. */
@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler implements ICommandHandler<DeleteMessageCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: MessagesRepository,
  ) {}

  /**
   * Deletes a message visible to a user.
   *
   * @param messageId - The message to delete.
   * @param userId - The sender or receiver requesting deletion.
   * @returns Nothing when deletion succeeds.
   * @throws {MessageNotFoundError} When the user cannot access the message.
   */
  async execute(command: DeleteMessageCommand): Promise<void> {
    const { messageId, userId } = command;
    return this.unitOfWork.execute(userId, async () => {
      const message = await this.repository.findByIdForUpdate(messageId);
      if (!message) throw new MessageNotFoundError();
      message.ensureVisibleTo(userId);
      await this.repository.delete(message);
    });
  }
}
