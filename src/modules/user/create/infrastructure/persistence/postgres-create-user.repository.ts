import { Injectable } from '@nestjs/common';
import { CreateSql } from './writes/create.sql';
import { ExistsSql } from './reads/exists.sql';
import type { CreatedUser } from '../../application/models/create-user.models';
import { CreateUserRepository } from '../../application/ports/create-user.repository';

/** PostgreSQL registration repository. */
@Injectable()
export class PostgresCreateUserRepository implements CreateUserRepository {
  public constructor(
    private readonly existsSql: ExistsSql,
    private readonly createSql: CreateSql,
  ) {}

  exists(username: string, email: string): Promise<boolean> {
    return this.existsSql.exists(username, email);
  }

  async create(username: string, fullName: string, email: string, gender: string, passwordHash: string): Promise<CreatedUser> {
    const { created_at: createdAt, ...user } = (await this.createSql.create(username, fullName, email, gender, passwordHash)).userData;
    return { ...user, createdAt };
  }
}
