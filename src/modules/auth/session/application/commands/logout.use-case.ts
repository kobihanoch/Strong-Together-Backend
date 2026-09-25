import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { SessionUnauthorizedError } from '../errors/session.errors';
import { AuthPolicy } from '../../../core/application/ports/auth-policy.port';
import { AuthTokens } from '../../../core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { SessionRepository } from '../ports/session.repository';

/** Invalidates the user's current session. */
@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: SessionRepository,
    private readonly tokens: AuthTokens,
    private readonly transaction: AuthenticationTransaction,
    private readonly policy: AuthPolicy,
  ) {}

  /**
   * Invalidates a refresh-token session and clears notification state.
   *
   * @param refreshToken - The refresh token supplied by the caller.
   * @param dpopJkt - The verified request DPoP thumbprint.
   * @returns A promise that resolves after logout completes.
   * @throws {SessionUnauthorizedError} When the token or proof binding is invalid.
   */
  async execute(refreshToken: string | null | undefined, dpopJkt?: string): Promise<void> {
    return this.unitOfWork.execute(undefined, async () => {
      if (!refreshToken) throw new SessionUnauthorizedError('No refresh token provided');
      const decoded = this.tokens.decodeRefresh(refreshToken, true);
      if (!decoded) throw new SessionUnauthorizedError('Invalid refresh token');

      if (this.policy.dpopEnabled && (!dpopJkt || !decoded.cnf?.jkt || decoded.cnf.jkt !== dpopJkt)) {
        throw new SessionUnauthorizedError('Proof-of-Possession failed (JKT mismatch).');
      }

      await this.transaction.promoteToUser(decoded.id);
      await this.repository.logout(decoded.id);
    });
  }
}
