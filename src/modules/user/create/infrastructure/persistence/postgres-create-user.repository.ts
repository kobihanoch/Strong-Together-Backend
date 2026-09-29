import { Injectable } from '@nestjs/common';
import { CreateSql } from './writes/create.sql';
import { ExistsSql } from './reads/exists.sql';
import { CreateUserRepository } from '../../application/ports/create-user.repository';
import { UserRegistration } from '../../domain/entities/user-registration';

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

  async create(registration: UserRegistration, passwordHash: string): Promise<UserRegistration> {
    const created = await this.createSql.create(
        registration.username.value,
        registration.fullName,
        registration.email.value,
        registration.gender,
        passwordHash,
      );
    return UserRegistration.restore(created.userData.id, {
      username: registration.username.value,
      fullName: registration.fullName,
      email: registration.email.value,
      password: registration.password.value,
      gender: registration.gender,
    });
  }
}
