import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class SaveSql {
  constructor(private readonly db: DBService) {}
  async save(messageId: string, isRead: boolean): Promise<void> {
    await this.db.sql`
      UPDATE messages.message
      SET
        is_read = ${isRead}
      WHERE
        id = ${messageId}::UUID
    `;
  }
}
