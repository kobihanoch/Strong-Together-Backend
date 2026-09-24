import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { RefreshSessionResult } from '../../../core/application/models/auth.models';
import { SessionUnauthorizedError } from '../errors/session.errors';
import { AuthPolicy } from '../../../core/application/ports/auth-policy.port';
import { AuthTokens } from '../../../core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { SessionRepository } from '../ports/session.repository';

/** Rotates a valid refresh-token session pair. */
@Injectable()
export class RefreshSessionUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly sessions: SessionRepository,
    private readonly tokens: AuthTokens,
    private readonly transaction: AuthenticationTransaction,
    private readonly policy: AuthPolicy,
  ) {}

  /**
   * Validates and rotates a refresh token into a fresh token pair.
   *
   * @param refreshToken - The refresh token supplied by the caller.
   * @param dpopJkt - The verified request DPoP thumbprint.
   * @returns The refreshed session payload.
   * @throws {SessionUnauthorizedError} When token state or proof binding is invalid.
   */
  async execute(refreshToken: string | null | undefined, dpopJkt: string | null | undefined): Promise<RefreshSessionResult> {
    return this.unitOfWork.execute(undefined, async () => {
      if (this.policy.dpopEnabled && !dpopJkt) throw new SessionUnauthorizedError('Invalid credentials');
      if (!refreshToken) throw new SessionUnauthorizedError('No refresh token provided');

      const decoded = this.tokens.decodeRefresh(refreshToken);
      if (!decoded) throw new SessionUnauthorizedError('Invalid or expired refresh token');

      if (this.policy.dpopEnabled && decoded.cnf?.jkt && decoded.cnf.jkt !== dpopJkt) {
        throw new SessionUnauthorizedError('Proof-of-Possession failed (JKT mismatch).');
      }

      await this.transaction.promoteToUser(decoded.id);
      const session = await this.sessions.rotateIfVersion(decoded.id, decoded.tokenVer);
      if (!session) throw new SessionUnauthorizedError('New login required');
      if (!session.userData.isVerified) throw new SessionUnauthorizedError('A verification email is pending');

      const issued = this.tokens.issueSession(session.userData.id, session.userData.role, session.tokenVersion, dpopJkt ?? undefined);
      return { message: 'Access token refreshed', userId: session.userData.id, ...issued };
    });
  }
}
