import { BadRequestException, Injectable } from '@nestjs/common';
import type { AppleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config';
import type { AppLogger } from '../../../infrastructure/logger';
import { DBService } from '../../../infrastructure/db/db.service';
import { SessionQueries } from '../../auth/session/session.queries';
import { buildCnfClaim } from '../oauth.utils';
import { AppleQueries } from './apple.queries';
import { verifyAppleIdToken } from './apple.utils';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service';

@Injectable()
export class AppleService {
  constructor(
    private readonly dbService: DBService,
    private readonly systemMessagesService: SystemMessagesService,
    private readonly sessionQueries: SessionQueries,
    private readonly appleQueries: AppleQueries,
  ) {}

  /**
   * Creates or sign in with apple.
   * @param body - The validated request body.
   * @param jkt - The DPoP key thumbprint.
   * @param requestLogger - The request-scoped logger.
   * @returns The create or sign in with apple result.
   */
  async createOrSignInWithAppleData(
    body: AppleOAuthBody,
    jkt: string,
    requestLogger: AppLogger,
  ): Promise<OAuthLoginResponse> {
    const { idToken, rawNonce, name, email } = body || {};

    if (!idToken || typeof idToken !== 'string') {
      throw new BadRequestException('Missing or invalid Apple identityToken');
    }
    if (!rawNonce || typeof rawNonce !== 'string') {
      throw new BadRequestException('Missing rawNonce');
    }

    const {
      appleSub,
      email: tokenEmail,
      emailVerified,
      fullName: normalizedName,
    } = await verifyAppleIdToken({
      identityToken: idToken,
      rawNonce,
      name,
    });

    const resolvedEmail = tokenEmail ?? email ?? null;

    let { userId } = await this.appleQueries.queryFindUserIdWithAppleUserId(appleSub);
    const userExistOnOAuthUsers = !!userId;

    if (!userExistOnOAuthUsers) {
      let isLinked = false;

      if (emailVerified && resolvedEmail) {
        const { userId: linkedId } = await this.appleQueries.queryTryToLinkUserWithEmailApple(resolvedEmail, appleSub);
        if (linkedId) {
          userId = linkedId;
          isLinked = true;
        }
      }

      if (!isLinked) {
        const username = resolvedEmail?.split('@')[0].toLowerCase() || null;
        const candidateFullName = normalizedName;

        const newUserId = await this.appleQueries.queryCreateUserWithAppleInfo(
          username,
          resolvedEmail,
          candidateFullName,
          appleSub,
          resolvedEmail,
        );
        userId = newUserId;
      }
    }

    const finalUserId = userId as string;
    const hasNeverLoggedIn = (await this.sessionQueries.queryLastLogin(finalUserId)) === null;
    await this.dbService.promoteCurrentRlsTxToAuthenticated(finalUserId);
    const rowsUserData = await this.sessionQueries.queryBumpTokenVersionAndGetSelfData(finalUserId);
    const [{ tokenVersion, userData }] = rowsUserData;

    if (hasNeverLoggedIn) {
      try {
        await this.systemMessagesService.sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name as string);
      } catch (e) {
        requestLogger.error(
          { err: e, event: 'oauth.apple_first_login_message_failed', userId: userData.id },
          'Failed to send Apple OAuth first-login message',
        );
      }
    }

    const cnfClaim = buildCnfClaim(jkt);
    const accessToken = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: tokenVersion,
        ...cnfClaim,
      },
      authConfig.jwtAccessSecret,
      { expiresIn: '5m' },
    );

    const refreshToken = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: tokenVersion,
        ...cnfClaim,
      },
      authConfig.jwtRefreshSecret,
      { expiresIn: '14d' },
    );

    return {
      message: 'Login successful',
      user: userData.id,
      accessToken,
      refreshToken,
    };
  }
}
