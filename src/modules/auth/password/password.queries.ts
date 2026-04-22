import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class PasswordQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUpdateUserPassword(userId: string, newPass: string): Promise<void> {
    await this.sql`
      UPDATE identity.users
      SET password=${newPass} 
      WHERE id=${userId}::uuid AND auth_provider='app'
    `;
  }
}
