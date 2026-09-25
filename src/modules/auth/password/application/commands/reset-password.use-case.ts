import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { PasswordBadRequestError } from '../errors/password.errors';
import { AuthTokens } from '../../../core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { OneTimeTokenStore } from '../../../core/application/ports/one-time-token-store.port';
import { PasswordHasher } from '../../../core/application/ports/password-hasher.port';
import { PasswordRepository } from '../ports/password.repository';
import { SessionRepository } from '../../../session/application/ports/session.repository';

/** Resets a password using a single-use reset token. */
@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly passwords: PasswordRepository,
    private readonly sessions: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: AuthTokens,
    private readonly oneTimeTokens: OneTimeTokenStore,
    private readonly transaction: AuthenticationTransaction,
  ) {}

  /**
   * Replaces a user's password and invalidates existing session state.
   *
   * @param token - The password-reset token.
   * @param newPassword - The replacement plaintext password.
   * @returns A promise that resolves after password and token state are updated.
   * @throws {PasswordBadRequestError} When the token is missing, invalid, expired, or already used.
   */
  async execute(token: string | undefined, newPassword: string): Promise<void> {
    return this.unitOfWork.execute(undefined, async () => {
      if (!token) throw new PasswordBadRequestError('Missing token');
      const decoded = this.tokens.decodePasswordReset(token);
      if (!decoded || decoded.iss !== 'strong-together' || decoded.typ !== 'forgot-pass' || !decoded.jti || !decoded.sub) {
        throw new PasswordBadRequestError('Verfication token is not valid');
      }

      const ttlSeconds = Math.max(1, decoded.exp - Math.floor(Date.now() / 1000));
      const claimed = await this.oneTimeTokens.claim('forgotpassword', decoded.jti, ttlSeconds);
      if (!claimed) throw new PasswordBadRequestError('URL already used or expired');

      const passwordHash = await this.passwordHasher.hash(newPassword);
      await this.transaction.promoteToUser(decoded.sub);
      await Promise.all([this.passwords.updatePassword(decoded.sub, passwordHash), this.sessions.rotate(decoded.sub)]);
    });
  }
}
