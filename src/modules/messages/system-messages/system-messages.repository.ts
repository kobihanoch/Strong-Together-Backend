import type { MessageAfterSendQueryDto } from '@strong-together/shared';

/**
 * Defines the persistence operations required by system-message use cases.
 *
 * The contract keeps system-message orchestration independent of SQL,
 * PostgreSQL, and the concrete query implementation.
 */
export abstract class SystemMessagesRepository {
  /**
   * Creates a system message for a recipient.
   *
   * @param senderId - The identifier of the system user sending the message.
   * @param receiverId - The identifier of the user receiving the message.
   * @param subject - The message subject.
   * @param message - The message body.
   * @returns The persisted message enriched with sender profile details.
   */
  abstract createSystemMessage(senderId: string, receiverId: string, subject: string, message: string): Promise<MessageAfterSendQueryDto>;
}
