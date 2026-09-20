import { Injectable } from '@nestjs/common';
import type { CreatedUser } from '../application/models/create-user.models';
import { CreateUserRepository } from '../application/ports/create-user.repository';
import { CreateUserSql } from './create-user.sql';

/** PostgreSQL registration repository. */
@Injectable()
export class PostgresCreateUserRepository implements CreateUserRepository {
  constructor(private readonly sql: CreateUserSql) {}

  exists(username: string, email: string): Promise<boolean> {
    return this.sql.exists(username, email);
  }

  async create(username: string, fullName: string, email: string, gender: string, passwordHash: string): Promise<CreatedUser> {
    const { created_at: createdAt, ...user } = (await this.sql.create(username, fullName, email, gender, passwordHash)).userData;
    return { ...user, createdAt };
  }
}
