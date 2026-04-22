import { Inject, Injectable } from '@nestjs/common';
import { MessageAfterSendResponse } from '@strong-together/shared';
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

    const [row] = await this.sql<[MessageAfterSendResponse]>`
      WITH inserted AS (
        INSERT INTO messages.messages (sender_id, receiver_id, subject, msg)
        VALUES (${senderId}::uuid, ${receiverId}::uuid, ${msg.header}, ${msg.text})
        RETURNING *
      )
      SELECT
        inserted.*,
        u.username          AS sender_username,
        u.name              AS sender_full_name,
        u.profile_image_url AS sender_profile_image_url,
        u.gender            AS sender_gender
      FROM inserted
      LEFT JOIN identity.users u ON u.id = inserted.sender_id
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
