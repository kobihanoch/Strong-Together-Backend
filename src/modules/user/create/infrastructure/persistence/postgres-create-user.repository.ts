import { Injectable } from '@nestjs/common';
import { CreateSql } from './writes/create.sql';
import { ExistsSql } from './reads/exists.sql';
import type { CreatedUser } from '../../application/models/create-user.models';
import { CreateUserRepository } from '../../application/ports/create-user.repository';
import type { UserRegistration } from '../../domain/entities/user-registration';

/** PostgreSQL registration repository. */
@Injectable()
export class PostgresCreateUserRepository implements CreateUserRepository {
  public constructor(
    private readonly existsSql: ExistsSql,
    private readonly createSql: CreateSql,
  ) {}

  exists(registration: UserRegistration): Promise<boolean> {
    return this.existsSql.exists(registration.username.value, registration.email.value);
  }

  async create(registration: UserRegistration, passwordHash: string): Promise<CreatedUser> {
    const { created_at: createdAt, ...user } = (
      await this.createSql.create(
        registration.username.value,
        registration.fullName,
        registration.email.value,
        registration.gender,
        passwordHash,
      )
    ).userData;
    return { ...user, createdAt };
  }
}
