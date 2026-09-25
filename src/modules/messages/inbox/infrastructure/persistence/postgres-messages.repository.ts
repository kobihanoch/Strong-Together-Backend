import { Injectable } from '@nestjs/common';
import { DeleteForUserSql } from './writes/delete-for-user.sql';
import { MarkAsReadSql } from './writes/mark-as-read.sql';
import { MessagesRepository } from '../../application/ports/messages.repository';
import type { DeleteMessageOutcome, MarkMessageAsReadOutcome } from '../../application/models/messages.models';

/** PostgreSQL adapter for message inbox persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresMessagesRepository implements MessagesRepository {
  public constructor(
    private readonly markAsReadSql: MarkAsReadSql,
    private readonly deleteForUserSql: DeleteForUserSql,
  ) {}
  async markAsRead(messageId: string, userId: string): Promise<MarkMessageAsReadOutcome> {
    return this.markAsReadSql.markAsRead(messageId, userId);
  }
  async deleteForUser(messageId: string, userId: string): Promise<DeleteMessageOutcome> {
    return this.deleteForUserSql.deleteForUser(messageId, userId);
  }
}
