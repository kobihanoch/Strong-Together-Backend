import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { UserAlreadyExistsError } from '../errors/create-user.errors';
import type { CreateUserInput } from '../models/create-user.models';
import { CreateUserRepository } from '../ports/create-user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { UserRegistrationEvents } from '../ports/user-registration-events.port';

/** Registers local users and schedules their initial verification email. */
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly repository: CreateUserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly events: UserRegistrationEvents,
    private readonly transactionHooks: TransactionHooks,
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
    if (await this.repository.exists(input.username, input.email)) throw new UserAlreadyExistsError();
    const passwordHash = await this.passwordHasher.hash(input.password);
    const created = await this.repository.create(input.username, input.fullName, input.email, input.gender, passwordHash);
    this.transactionHooks.afterCommit(() => this.events.userRegistered(created.id, input.email, input.fullName, requestId));
  }
}
