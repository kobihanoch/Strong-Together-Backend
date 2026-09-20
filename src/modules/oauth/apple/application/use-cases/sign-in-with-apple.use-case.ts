import { Injectable } from '@nestjs/common';
import { AuthTokens } from '../../../../auth/core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../../auth/core/application/ports/authentication-transaction.port';
import { AuthenticationEvents } from '../../../../auth/session/application/ports/authentication-events.port';
import { SessionRepository } from '../../../../auth/session/application/ports/session.repository';
import type { OAuthLoginResult, OAuthRequestLogger } from '../../../core/application/models/oauth.models';
import { OAuthRepository } from '../../../core/application/ports/oauth.repository';
import { AppleOAuthUnauthorizedError, InvalidAppleOAuthError } from '../errors/apple-oauth.errors';
import type { AppleOAuthInput } from '../models/apple-oauth.models';
import { AppleIdentityVerifier } from '../ports/apple-identity-verifier.port';

/** Authenticates or registers a user with Apple OAuth. */
@Injectable()
export class SignInWithAppleUseCase {
  constructor(
    private readonly repository: OAuthRepository,
    private readonly identityVerifier: AppleIdentityVerifier,
    private readonly authenticationTransaction: AuthenticationTransaction,
    private readonly authTokens: AuthTokens,
    private readonly authenticationEvents: AuthenticationEvents,
    private readonly sessions: SessionRepository,
  ) {}

  /**
   * Authenticates, links, or creates a user from an Apple identity.
   *
   * @param body - The validated request body.
   * @param jkt - The DPoP key thumbprint.
   * @param requestLogger - The request-scoped logger.
   * @returns The issued application session.
   * @throws {InvalidAppleOAuthError} When required Apple identity input is missing.
   * @throws {AppleOAuthUnauthorizedError} When the linked user cannot start a session.
   */
  async execute(body: AppleOAuthInput, jkt: string, requestLogger: OAuthRequestLogger): Promise<OAuthLoginResult> {
    const { idToken, rawNonce, name, email } = body || {};

    if (!idToken || typeof idToken !== 'string') {
      throw new InvalidAppleOAuthError('Missing or invalid Apple identityToken');
    }
    if (!rawNonce || typeof rawNonce !== 'string') {
      throw new InvalidAppleOAuthError('Missing rawNonce');
    }

    const { appleSub, email: tokenEmail, emailVerified, fullName: normalizedName } = await this.identityVerifier.verify(idToken, rawNonce, name);

    const resolvedEmail = tokenEmail ?? email ?? null;

    let userId = await this.repository.findLinkedUser('apple', appleSub);
    const userExistOnOAuthUsers = !!userId;

    if (!userExistOnOAuthUsers) {
      let isLinked = false;

      if (emailVerified && resolvedEmail) {
        const linkedId = await this.repository.linkByVerifiedEmail('apple', resolvedEmail, appleSub);
        if (linkedId) {
          userId = linkedId;
          isLinked = true;
        }
      }

      if (!isLinked) {
        const username = resolvedEmail?.split('@')[0].toLowerCase() || null;
        const candidateFullName = normalizedName;

        const newUserId = await this.repository.createUser('apple', username, resolvedEmail, candidateFullName, appleSub, resolvedEmail);
        userId = newUserId;
      }
    }

    const finalUserId = userId as string;
    const hasNeverLoggedIn = (await this.sessions.findLastLogin(finalUserId)) === null;
    await this.authenticationTransaction.promoteToUser(finalUserId);
    const { tokenVersion, userData } = await this.sessions.rotate(finalUserId);
    if (!userData.isVerified) throw new AppleOAuthUnauthorizedError('A verification email is pending');

    if (hasNeverLoggedIn) {
      try {
        await this.authenticationEvents.userFirstLogin(userData.id, userData.name as string);
      } catch (e) {
        requestLogger.error(
          { err: e, event: 'oauth.apple_first_login_message_failed', userId: userData.id },
          'Failed to send Apple OAuth first-login message',
        );
      }
    }

    const { accessToken, refreshToken } = this.authTokens.issueSession(userData.id, userData.role, tokenVersion, jkt);

    return {
      message: 'Login successful',
      user: userData.id,
      accessToken,
      refreshToken,
    };
  }
}
