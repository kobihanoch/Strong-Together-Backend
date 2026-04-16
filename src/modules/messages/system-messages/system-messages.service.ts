import { Inject, Injectable } from '@nestjs/common';
import { MessageAfterSendResponse } from '@strong-together/shared';
import type postgres from 'postgres';
import { appConfig } from '../../../config/app.config.ts';
import { SQL } from '../../../infrastructure/db/db.tokens.ts';
import { MessagesService } from '../messages.service.ts';
import { getEndOfWorkoutMessage, getFirstLoginMessage } from './system-messages.templates.ts';

@Injectable()
export class SystemMessagesService {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(SQL) private readonly sql: postgres.Sql,
  ) {}

  private async createAndSend(receiverId: string, msg: { header: string; text: string }) {
    const senderId = appConfig.systemUserId as string;

    const [row] = await this.sql<[MessageAfterSendResponse]>`
      WITH inserted AS (
        INSERT INTO messages (sender_id, receiver_id, subject, msg)
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
      LEFT JOIN users u ON u.id = inserted.sender_id
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
