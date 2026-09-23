import { Injectable } from '@nestjs/common';
import { OperationLogger } from '../../../../../common/application/ports/operation-logger.port';
import type { EmailChangeOutcome } from '../models/update-user.models';
import { EmailChangeTokens } from '../ports/email-change-tokens.port';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Confirms a one-time user email-address change. */
@Injectable()
export class ConfirmEmailChangeUseCase {
  constructor(
    private readonly tokens: EmailChangeTokens,
    private readonly repository: UserProfileRepository,
    private readonly logger: OperationLogger,
  ) {}
  /**
   * Confirms an email-change token once.
   *
   * @param token - Signed token, when provided.
   * @returns The domain outcome and optional failure reason.
   */
  async execute(token: string | undefined): Promise<EmailChangeOutcome> {
    if (!token) return { kind: 'missing-token', reason: 'Missing token' };
    const claims = this.tokens.verify(token);
    if (!claims) return { kind: 'invalid-token', reason: 'Invalid or expired link' };
    if (claims.iss !== 'strong-together' || claims.typ !== 'email-confirm' || !claims.jti || !claims.sub || !claims.newEmail || !claims.exp)
      return { kind: 'malformed-token', reason: 'Malformed token' };
    if (!(await this.tokens.consume(claims.jti, claims.exp))) return { kind: 'token-already-used', reason: 'URL already used or expired' };
    try {
      const outcome = await this.repository.updateEmail(claims.sub, claims.newEmail.trim().toLowerCase());
      if (outcome.kind === 'conflict') {
        this.logger.warn({ event: 'user.email_change_conflict', userId: claims.sub }, 'Email already in use');
        return { kind: 'email-in-use', reason: 'Email already in use' };
      }
    } catch (error) {
      this.logger.error({ err: error, event: 'user.email_change_failed', userId: claims.sub }, 'Failed to update user email');
      return { kind: 'failed', reason: 'Server error' };
    }
    return { kind: 'confirmed' };
  }
}
