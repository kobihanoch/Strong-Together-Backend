import { Injectable } from '@nestjs/common';
import type { AllUserMessageQueryDto, DeletedMessageQueryDto, MessageAsReadQueryDto } from '@strong-together/shared';
import { MessagesQueries } from './messages.queries';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class PostgresMessagesRepository implements MessagesRepository {
  constructor(private readonly queries: MessagesQueries) {}

  findMessagesByUser(userId: string, timezone: string): Promise<AllUserMessageQueryDto[]> {
    return this.queries.queryAllUserMessages(userId, timezone);
  }

  markMessageAsReadForUser(messageId: string, userId: string): Promise<MessageAsReadQueryDto[]> {
    return this.queries.queryMarkUserMessageAsRead(messageId, userId);
  }

  deleteMessageForUser(messageId: string, userId: string): Promise<DeletedMessageQueryDto[]> {
    return this.queries.queryDeleteMessage(messageId, userId);
  }
}
