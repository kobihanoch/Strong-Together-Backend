import { Injectable } from '@nestjs/common';
import { appConfig } from '../../../config/app.config';
import { DBService } from '../../../infrastructure/db/db.service';
import { getEndOfWorkoutMessage, getFirstLoginMessage } from './system-messages.templates';
import { SystemMessagesRepository } from './system-messages.repository';
import { MessagesService } from '../messages.service';

@Injectable()
export class SystemMessagesService {
  constructor(
    private readonly dbService: DBService,
    private readonly messagesService: MessagesService,
    private readonly systemMessagesRepository: SystemMessagesRepository,
  ) {}

  /**
   * Creates a system message and delivers it to the recipient.
   * @param receiverId - The recipient user identifier.
   * @param msg - The message to deliver.
   */
  private async createAndSend(receiverId: string, msg: { header: string; text: string }) {
    const senderId = appConfig.systemUserId as string;

    const row = await this.systemMessagesRepository.createSystemMessage(senderId, receiverId, msg.header, msg.text);

    this.dbService.afterCommit(async () => {
      this.messagesService.emitNewMessage(receiverId, row);
    });
    return row;
  }

  /**
   * Sends system message to user workout done.
   * @param receiverId - The recipient user identifier.
   */
  async sendSystemMessageToUserWorkoutDone(receiverId: string) {
    return this.createAndSend(receiverId, getEndOfWorkoutMessage());
  }

  /**
   * Sends system message to user when first login.
   * @param receiverId - The recipient user identifier.
   * @param receiverName - The recipient display name.
   */
  async sendSystemMessageToUserWhenFirstLogin(receiverId: string, receiverName: string) {
    return this.createAndSend(receiverId, getFirstLoginMessage(receiverName));
  }
}
