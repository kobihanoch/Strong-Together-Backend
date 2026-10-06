import { Injectable } from '@nestjs/common';
import { FindByUserSql } from './reads/find-by-user.sql';
import type { InboxMessage } from '../../application/models/messages.models';
import { MessagesQueries } from '../../application/ports/messages.queries';

/** PostgreSQL adapter for message inbox persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresMessagesQueries implements MessagesQueries {
  public constructor(private readonly findByUserSql: FindByUserSql) {}
  async findByUser(timezone: string): Promise<InboxMessage[]> {
    const rows = await this.findByUserSql.findByUser(timezone);
    return rows.map((row) => ({ ...row, sentAt: row.sentAt.toISOString() }));
  }
}
