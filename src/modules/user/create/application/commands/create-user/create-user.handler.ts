import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { UserAlreadyExistsError } from '../../errors/create-user.errors';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { PasswordHasher } from '../../ports/password-hasher.port';
import { UserRegistrationEvents } from '../../ports/user-registration-events.port';
import { UserRegistration } from '../../../domain/entities/user-registration';
import { CreateUserCommand } from './create-user.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Registers local users and schedules their initial verification email. */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
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
  async execute(command: CreateUserCommand): Promise<void> {
    const { input, requestId } = command;
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
