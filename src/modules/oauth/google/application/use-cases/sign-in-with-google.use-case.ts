import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { OperationLogger } from '../../../../../common/application/ports/operation-logger.port';
import { AuthTokens } from '../../../../auth/core/application/ports/auth-tokens.port';
import { AuthenticationTransaction } from '../../../../auth/core/application/ports/authentication-transaction.port';
import { AuthenticationEvents } from '../../../../auth/session/application/ports/authentication-events.port';
import { SessionRepository } from '../../../../auth/session/application/ports/session.repository';
import type { OAuthLoginResult } from '../../../core/application/models/oauth.models';
import { OAuthRepository } from '../../../core/application/ports/oauth.repository';
import { GoogleOAuthUnauthorizedError, InvalidGoogleOAuthError } from '../errors/google-oauth.errors';
import type { GoogleOAuthInput } from '../models/google-oauth.models';
import { GoogleIdentityVerifier } from '../ports/google-identity-verifier.port';

/** Authenticates or registers a user with Google OAuth. */
@Injectable()
export class SignInWithGoogleUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: OAuthRepository,
    private readonly identityVerifier: GoogleIdentityVerifier,
    private readonly authenticationTransaction: AuthenticationTransaction,
    private readonly authTokens: AuthTokens,
    private readonly authenticationEvents: AuthenticationEvents,
    private readonly sessions: SessionRepository,
    private readonly logger: OperationLogger,
  ) {}

  /**
   * Authenticates, links, or creates a user from a Google identity.
   *
   * @param body - The validated request body.
   * @param jkt - The DPoP key thumbprint.
   * @returns The issued application session.
   * @throws {InvalidGoogleOAuthError} When the identity token is missing or invalid.
   * @throws {GoogleOAuthUnauthorizedError} When the linked user cannot start a session.
   */
  async execute(body: GoogleOAuthInput, jkt: string): Promise<OAuthLoginResult> {
    return this.unitOfWork.execute(undefined, async () => {
      const idToken = body.idToken;

      if (!idToken) throw new InvalidGoogleOAuthError('Missing google id token');
      const verification = await this.identityVerifier.verify(idToken);
      if (verification.kind === 'invalid-audience') throw new InvalidGoogleOAuthError('Invalid audience for Google ID token');
      const { googleSub, email, emailVerified, fullName } = verification.identity;

      let userId = await this.repository.findLinkedUser('google', googleSub);
      const userExistOnOAuthUsers = !!userId;

      if (!userExistOnOAuthUsers) {
        let isLinked = false;
        this.logger.info({ event: 'oauth.google_link_attempt_started', emailVerified }, 'Google OAuth user not found, trying to link');
        if (emailVerified) {
          const userIdFromLink = email ? await this.repository.linkByVerifiedEmail('google', email, googleSub) : null;
          if (userIdFromLink) {
            userId = userIdFromLink;
            isLinked = true;
            this.logger.info({ event: 'oauth.google_link_succeeded', userId }, 'Google OAuth user linked successfully');
          }
        }

        if (!isLinked) {
          this.logger.info({ event: 'oauth.google_registration_started' }, 'Google OAuth link failed, creating a new user');
          const username = email?.split('@')[0].toLowerCase() || null;

          const userIdFromRegister = await this.repository.createUser('google', username, email, fullName, googleSub, email);
          userId = userIdFromRegister;

          this.logger.info({ event: 'oauth.google_registration_completed', userId }, 'Google OAuth user created');
        }
      }

      const finalUserId = userId as string;
      this.logger.info({ event: 'oauth.google_login_completed', userId: finalUserId }, 'Google OAuth user authenticated');

      const hasNeverLoggedIn = (await this.sessions.findLastLogin(finalUserId)) === null;
      await this.authenticationTransaction.promoteToUser(finalUserId);
      const { tokenVersion, userData } = await this.sessions.rotate(finalUserId);
      if (!userData.isVerified) throw new GoogleOAuthUnauthorizedError('A verification email is pending');
      if (hasNeverLoggedIn) {
        try {
          await this.authenticationEvents.userFirstLogin(userData.id, userData.name as string);
        } catch (e) {
          this.logger.error(
            { err: e, event: 'oauth.google_first_login_message_failed', userId: userData.id },
            'Failed to send Google OAuth first-login message',
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
    });
  }
}
