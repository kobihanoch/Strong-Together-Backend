import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { OperationLogger } from '../../../../../../common/application/ports/operation-logger.port';
import type { LoginResult } from '../../../../core/application/models/auth.models';
import { SessionBadRequestError, SessionUnauthorizedError } from '../../errors/session.errors';
import { AuthPolicy } from '../../../../core/application/ports/auth-policy.port';
import { AuthTokens } from '../../../../core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../../core/application/ports/authentication-transaction.port';
import { PasswordHasher } from '../../../../core/application/ports/password-hasher.port';
import { AuthenticationEvents } from '../../ports/authentication-events.port';
import { SessionRepository } from '../../ports/session.repository';
import { LoginCredentials } from '../../../domain/entities/login-credentials';
import { LoginCommand } from './login.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Authenticates credentials and starts a session. */
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: AuthTokens,
    private readonly transaction: AuthenticationTransaction,
    private readonly policy: AuthPolicy,
    private readonly events: AuthenticationEvents,
    private readonly logger: OperationLogger,
  ) {}

  /**
   * Authenticates a user and issues a fresh token pair.
   *
   * @param identifier - The submitted username or email address.
   * @param password - The submitted plaintext password.
   * @param jkt - The optional DPoP key thumbprint.
   * @returns The successful login payload.
   * @throws {SessionBadRequestError} When required DPoP binding is missing.
   * @throws {SessionUnauthorizedError} When credentials or verification state are invalid.
   */
  async execute(command: LoginCommand): Promise<LoginResult> {
    const { identifier, password, jkt } = command;
    return this.unitOfWork.execute(undefined, async () => {
      if (this.policy.dpopEnabled && !jkt) throw new SessionBadRequestError('DPoP-Key-Binding header is missing.');
      const credentials = LoginCredentials.create(identifier, password);
      const user = await this.repository.findByIdentifier(credentials.identifier);
      if (!user) throw new SessionUnauthorizedError('Invalid credentials');

      const matches = await this.passwordHasher.compare(credentials.password, user.passwordHash!);
      if (!matches) throw new SessionUnauthorizedError('Invalid credentials');
      if (!user.isVerified) throw new SessionUnauthorizedError('A verification email is pending');

      await this.transaction.promoteToUser(user.id);

      if (user.lastLogin === null) {
        try {
          await this.events.userFirstLogin(user.id, user.name!);
        } catch (error) {
          this.logger.error({ err: error, event: 'auth.first_login_message_failed', userId: user.id }, 'Failed to send first-login message');
        }
      }

      const { tokenVersion, userData } = await this.repository.rotate(user.id);
      const issued = this.tokens.issueSession(userData.id, userData.role, tokenVersion, jkt);
      return { message: 'Login successful', user: userData.id, ...issued };
    });
  }
}
