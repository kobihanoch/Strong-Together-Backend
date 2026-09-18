import type { AllUserMessageQueryDto, DeletedMessageQueryDto, MessageAsReadQueryDto } from '@strong-together/shared';

/**
 * Defines the persistence operations required by user-message use cases.
 *
 * The contract keeps application services independent of SQL, PostgreSQL,
 * and the concrete query implementation used to store inbox messages.
 */
export abstract class MessagesRepository {
  /**
   * Retrieves all messages visible to a user.
   *
   * @param userId - The identifier of the user whose messages are requested.
   * @param timezone - The IANA time-zone name used for message timestamps.
   * @returns The user's messages ordered from newest to oldest.
   */
  abstract findMessagesByUser(userId: string, timezone: string): Promise<AllUserMessageQueryDto[]>;

  /**
   * Marks a message as read for its receiving user.
   *
   * @param messageId - The identifier of the message to update.
   * @param userId - The identifier of the receiving user.
   * @returns The updated message row, or an empty array when no permitted message exists.
   */
  abstract markMessageAsReadForUser(messageId: string, userId: string): Promise<MessageAsReadQueryDto[]>;

  /**
   * Deletes a message visible to its sender or receiver.
   *
   * @param messageId - The identifier of the message to delete.
   * @param userId - The identifier of the user requesting deletion.
   * @returns The deleted message row, or an empty array when no permitted message exists.
   */
  abstract deleteMessageForUser(messageId: string, userId: string): Promise<DeletedMessageQueryDto[]>;
}
