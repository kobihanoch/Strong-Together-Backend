import { Injectable } from '@nestjs/common';
import { DeleteSql } from './writes/delete.sql';
import { SaveSql } from './writes/save.sql';
import { FindByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import { MessagesRepository } from '../../application/ports/messages.repository';
import { Message } from '../../../domain/entities/message';

/** PostgreSQL adapter for message inbox persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresMessagesRepository implements MessagesRepository {
  public constructor(
    private readonly findByIdForUpdateSql: FindByIdForUpdateSql,
    private readonly saveSql: SaveSql,
    private readonly deleteSql: DeleteSql,
  ) {}
  async findByIdForUpdate(messageId: string): Promise<Message | undefined> {
    const row = await this.findByIdForUpdateSql.findByIdForUpdate(messageId);
    return row ? Message.restore({ ...row, body: row.msg }) : undefined;
  }
  save(message: Message): Promise<void> {
    if (!message.id) throw new Error('Cannot save a message without an ID');
    return this.saveSql.save(message.id, message.isRead);
  }
  delete(message: Message): Promise<void> {
    if (!message.id) throw new Error('Cannot delete a message without an ID');
    return this.deleteSql.delete(message.id);
  }
}
