import { Injectable } from '@nestjs/common';
import type { InboxMessage } from '../application/models/messages.models';
import { MessagesRepository } from '../application/ports/messages.repository';
import { MessagesSql } from './messages.sql';

/** PostgreSQL adapter for message inbox persistence. */
@Injectable()
export class PostgresMessagesRepository implements MessagesRepository {
  constructor(private readonly sql: MessagesSql) {}

  async findByUser(userId: string, timezone: string): Promise<InboxMessage[]> {
    const rows = await this.sql.findByUser(userId, timezone);
    return rows.map((row) => ({ ...row, sentAt: row.sentAt.toISOString() }));
  }

  async markAsRead(messageId: string, userId: string): Promise<boolean> { return (await this.sql.markAsRead(messageId, userId)).length > 0; }
  async deleteForUser(messageId: string, userId: string): Promise<boolean> { return (await this.sql.deleteForUser(messageId, userId)).length > 0; }
}
