import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

/** Persists a password hash already produced by the application workflow. */
@Injectable()
export class SaveSql {
  constructor(private readonly db: DBService) {}

  async save(userId: string, passwordHash: string): Promise<void> {
    await this.db.sql`
      UPDATE identity.user
      SET
        password_hash = ${passwordHash}
      WHERE
        id = ${userId}::UUID
        AND auth_provider = 'app'
    `;
  }
}
