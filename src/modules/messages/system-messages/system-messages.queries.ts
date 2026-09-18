import { Injectable } from '@nestjs/common';
import type { MessageAfterSendQueryDto } from '@strong-together/shared';
import { DBService } from '../../../infrastructure/db/db.service';

/** Executes system-message persistence operations inside the active request transaction. */
@Injectable()
export class SystemMessagesQueries {
  /**
   * Creates a system-message query provider.
   *
   * @param dbService - The database service that supplies the active SQL transaction.
   */
  constructor(private readonly dbService: DBService) {}

  /**
   * Inserts a system message and returns its delivery payload with sender details.
   *
   * @param senderId - The identifier of the system user sending the message.
   * @param receiverId - The identifier of the user receiving the message.
   * @param subject - The message subject.
   * @param message - The message body.
   * @returns The inserted message enriched with the system sender's profile details.
   */
  async queryCreateSystemMessage(senderId: string, receiverId: string, subject: string, message: string): Promise<[MessageAfterSendQueryDto]> {
    return this.dbService.sql<[MessageAfterSendQueryDto]>`
      WITH
        inserted AS (
          INSERT INTO
            messages.message (sender_id, receiver_id, subject, msg)
          VALUES
            (
              ${senderId}::UUID,
              ${receiverId}::UUID,
              ${subject},
              ${message}
            )
          RETURNING
            *
        )
      SELECT
        inserted.id,
        inserted.sender_id AS "senderId",
        inserted.receiver_id AS "receiverId",
        inserted.subject,
        inserted.msg,
        inserted.sent_at AS "sentAt",
        inserted.is_read AS "isRead",
        u.username AS "senderUsername",
        u.name AS "senderFullName",
        u.profile_pic_path AS "senderProfilePicPath",
        u.gender AS "senderGender"
      FROM
        inserted
        LEFT JOIN identity.user u ON u.id = inserted.sender_id
    `;
  }
}
