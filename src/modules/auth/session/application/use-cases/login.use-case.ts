import { Injectable } from '@nestjs/common';
import type { AuthRequestLogger, LoginResult } from '../../../core/application/models/auth.models';
import { SessionBadRequestError, SessionUnauthorizedError } from '../errors/session.errors';
import { AuthPolicy } from '../../../core/application/ports/auth-policy.port';
import { AuthTokens } from '../../../core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { PasswordHasher } from '../../../core/application/ports/password-hasher.port';
import { AuthenticationEvents } from '../ports/authentication-events.port';
import { SessionRepository } from '../ports/session.repository';

/** Authenticates credentials and starts a session. */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: AuthTokens,
    private readonly transaction: AuthenticationTransaction,
    private readonly policy: AuthPolicy,
    private readonly events: AuthenticationEvents,
  ) {}

  /**
   * Authenticates a user and issues a fresh token pair.
   *
   * @param identifier - The submitted username or email address.
   * @param password - The submitted plaintext password.
   * @param jkt - The optional DPoP key thumbprint.
   * @param logger - The request-correlated authentication logger.
   * @returns The successful login payload.
   * @throws {SessionBadRequestError} When required DPoP binding is missing.
   * @throws {SessionUnauthorizedError} When credentials or verification state are invalid.
   */
  async execute(identifier: string, password: string, jkt: string | undefined, logger: AuthRequestLogger): Promise<LoginResult> {
    if (this.policy.dpopEnabled && !jkt) throw new SessionBadRequestError('DPoP-Key-Binding header is missing.');

    const user = await this.sessions.findLoginUser(identifier);
    if (!user) throw new SessionUnauthorizedError('Invalid credentials');

    const matches = await this.passwordHasher.compare(password, user.passwordHash!);
    if (!matches) throw new SessionUnauthorizedError('Invalid credentials');
    if (!user.isVerified) throw new SessionUnauthorizedError('A verification email is pending');

    await this.transaction.promoteToUser(user.id);

    if (user.lastLogin === null) {
      try {
        await this.events.userFirstLogin(user.id, user.name!);
      } catch (error) {
        logger.error({ err: error, event: 'auth.first_login_message_failed', userId: user.id }, 'Failed to send first-login message');
      }
    }

    const { tokenVersion, userData } = await this.sessions.rotate(user.id);
    const issued = this.tokens.issueSession(userData.id, userData.role, tokenVersion, jkt);
    return { message: 'Login successful', user: userData.id, ...issued };
  }
}
