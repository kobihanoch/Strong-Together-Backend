import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { UserAlreadyExistsError } from '../errors/create-user.errors';
import type { CreateUserInput } from '../models/create-user.models';
import { CreateUserRepository } from '../ports/create-user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { UserRegistrationEvents } from '../ports/user-registration-events.port';
import { UserRegistration } from '../../domain/entities/user-registration';

/** Registers local users and schedules their initial verification email. */
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: CreateUserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly events: UserRegistrationEvents,
  ) {}
  /**
   * Creates a local account when its username and email are available.
   *
   * @param input - Validated registration values.
   * @param requestId - Optional request correlation identifier.
   * @returns Nothing after registration is persisted and email delivery is scheduled.
   * @throws {UserAlreadyExistsError} When the username or email is already used.
   */
  async execute(input: CreateUserInput, requestId?: string): Promise<void> {
    return this.unitOfWork.execute(undefined, async () => {
      const registration = UserRegistration.create(input);
      if (await this.repository.exists(registration)) throw new UserAlreadyExistsError();
      const passwordHash = await this.passwordHasher.hash(registration.password.value);
      const created = await this.repository.create(registration, passwordHash);
      const createdUserId = created.id;
      if (!createdUserId) throw new Error('Created user is missing an ID');
      this.unitOfWork.afterCommit(() => this.events.userRegistered(createdUserId, created.email.value, created.fullName, requestId));
    });
  }
}
