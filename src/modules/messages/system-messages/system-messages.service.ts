import { Inject, Injectable } from '@nestjs/common';
import type { MessageAfterSendQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { appConfig } from '../../../config/app.config';
import { SQL } from '../../../infrastructure/db/db.tokens';
import { getEndOfWorkoutMessage, getFirstLoginMessage } from './system-messages.templates';
import { MessagesService } from '../messages.service';

@Injectable()
export class SystemMessagesService {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly messagesService: MessagesService,
  ) {}

  private async createAndSend(receiverId: string, msg: { header: string; text: string }) {
    const senderId = appConfig.systemUserId as string;

    const [row] = await this.sql<[MessageAfterSendQueryDto]>`
      WITH
        inserted AS (
          INSERT INTO
            messages.message (sender_id, receiver_id, subject, msg)
          VALUES
            (
              ${senderId}::UUID,
              ${receiverId}::UUID,
              ${msg.header},
              ${msg.text}
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

    this.messagesService.emitNewMessage(receiverId, row);
    return row;
  }

  async sendSystemMessageToUserWorkoutDone(receiverId: string) {
    return this.createAndSend(receiverId, getEndOfWorkoutMessage());
  }

  async sendSystemMessageToUserWhenFirstLogin(receiverId: string, receiverName: string) {
    return this.createAndSend(receiverId, getFirstLoginMessage(receiverName));
  }
}
