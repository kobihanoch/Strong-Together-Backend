import { Module } from '@nestjs/common';
import { CreateUserRepository } from './application/ports/create-user.repository';
import { PasswordHasher } from './application/ports/password-hasher.port';
import { UserRegistrationEvents } from './application/ports/user-registration-events.port';
import { CreateUserUseCase } from './application/commands/create-user.use-case';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password.hasher';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { ExistsSql } from './infrastructure/persistence/reads/exists.sql';
import { PostgresCreateUserRepository } from './infrastructure/persistence/postgres-create-user.repository';
import { NestUserRegistrationEvents } from './infrastructure/nest-user-registration.events';
import { CreateUserController } from './presentation/create-user.controller';
/** Composes user registration and its adapters. */
@Module({
  controllers: [CreateUserController],
  providers: [
    CreateSql,
    ExistsSql,
    { provide: CreateUserRepository, useClass: PostgresCreateUserRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: UserRegistrationEvents, useClass: NestUserRegistrationEvents },
    CreateUserUseCase,
  ],
})
export class CreateUserModule {}
