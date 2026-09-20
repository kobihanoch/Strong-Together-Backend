import { Module } from '@nestjs/common';
import { CreateUserRepository } from './application/ports/create-user.repository';
import { PasswordHasher } from './application/ports/password-hasher.port';
import { UserRegistrationEvents } from './application/ports/user-registration-events.port';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password.hasher';
import { CreateUserSql } from './infrastructure/create-user.sql';
import { PostgresCreateUserRepository } from './infrastructure/postgres-create-user.repository';
import { NestUserRegistrationEvents } from './infrastructure/nest-user-registration.events';
import { CreateUserController } from './presentation/create-user.controller';
/** Composes user registration and its adapters. */
@Module({
  controllers: [CreateUserController],
  providers: [
    CreateUserSql,
    { provide: CreateUserRepository, useClass: PostgresCreateUserRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: UserRegistrationEvents, useClass: NestUserRegistrationEvents },
    CreateUserUseCase,
  ],
})
export class CreateUserModule {}
