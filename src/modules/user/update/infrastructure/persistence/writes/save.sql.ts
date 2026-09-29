import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class SaveSql {
  constructor(private readonly db: DBService) {}

  async save(values: { username: string; fullName: string; pendingEmail?: string }): Promise<void> {
    // Probe the unique email constraint without committing the unconfirmed address.
    if (values.pendingEmail) {
      try {
        await this.db.sql`SAVEPOINT email_probe`;
        try {
          await this.db.sql`
            UPDATE identity.user
            SET
              email = ${values.pendingEmail}
            WHERE
              id = identity.current_user_id ()
          `;
          await this.db.sql`ROLLBACK TO SAVEPOINT email_probe`;
        } catch (error) {
          await this.db.sql`ROLLBACK TO SAVEPOINT email_probe`;
          throw error;
        }
      } catch (error) {
        if (error instanceof postgres.PostgresError && error.code !== '25P01') throw error;
      }
    }
    await this.db.sql`
      UPDATE identity.user
      SET
        username = ${values.username},
        name = ${values.fullName}
      WHERE
        id = identity.current_user_id ()
    `;
  }
}
