import { Injectable } from '@nestjs/common';
import { SaveSql } from './writes/save.sql';
import { PasswordRepository } from '../../application/ports/password.repository';

/** PostgreSQL password repository. */
@Injectable()
export class PostgresPasswordRepository implements PasswordRepository {
  public constructor(private readonly saveSql: SaveSql) {}

  save(userId: string, passwordHash: string): Promise<void> {
    return this.saveSql.save(userId, passwordHash);
  }
}
