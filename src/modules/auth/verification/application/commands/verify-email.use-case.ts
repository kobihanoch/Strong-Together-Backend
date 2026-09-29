import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { EmailVerificationOutcome } from '../../../core/application/models/auth.models';
import { VerificationBadRequestError } from '../errors/verification.errors';
import { AuthTokens } from '../../../core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../core/application/ports/authentication-transaction.port';
import { OneTimeTokenStore } from '../../../core/application/ports/one-time-token-store.port';
import { VerificationRepository } from '../ports/verification.repository';

/** Verifies an account using a single-use email token. */
@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: VerificationRepository,
    private readonly tokens: AuthTokens,
    private readonly oneTimeTokens: OneTimeTokenStore,
    private readonly transaction: AuthenticationTransaction,
  ) {}

  /**
   * Validates an email-verification token and marks its account verified.
   *
   * @param token - The email-verification token.
   * @returns The verification outcome used by the HTTP presentation.
   * @throws {VerificationBadRequestError} When the token is missing.
   */
  async execute(token: string | undefined): Promise<EmailVerificationOutcome> {
    return this.unitOfWork.execute(undefined, async () => {
      if (!token) throw new VerificationBadRequestError('Missing token');
      const decoded = this.tokens.decodeVerification(token);
      if (!decoded) return 'unauthorized';
      if (decoded.iss !== 'strong-together' || decoded.typ !== 'email-verify' || !decoded.jti || !decoded.sub) return 'invalid';

      const ttlSeconds = Math.max(1, decoded.exp - Math.floor(Date.now() / 1000));
      const claimed = await this.oneTimeTokens.claim('accountverify', decoded.jti, ttlSeconds);
      if (!claimed) return 'unauthorized';

      await this.transaction.promoteToUser(decoded.sub);
      await this.repository.updateVerification(decoded.sub, true);
      return 'verified';
    });
  }
}
