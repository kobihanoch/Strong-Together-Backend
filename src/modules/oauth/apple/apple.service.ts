import { BadRequestException, Injectable } from '@nestjs/common';
import type { AppleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config';
import type { AppLogger } from '../../../infrastructure/logger';
import { SessionQueries } from '../../auth/session/session.queries';
import { buildCnfClaim } from '../oauth.utils';
import { AppleQueries } from './apple.queries';
import { verifyAppleIdToken } from './apple.utils';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service';

@Injectable()
export class AppleService {
  constructor(
    private readonly systemMessagesService: SystemMessagesService,
    private readonly sessionQueries: SessionQueries,
    private readonly appleQueries: AppleQueries,
  ) {}

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

    let { userId, missing_fields } = await this.appleQueries.queryFindUserIdWithAppleUserId(appleSub);
    const userExistOnOAuthUsers = !!userId;

    let missingFieldsPayload = null;
    if (userExistOnOAuthUsers && missing_fields) {
      missingFieldsPayload = missing_fields.split(',');
    }

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
        const isValidEmail = !!resolvedEmail;
        const candidateFullName = normalizedName;
        const isValidFullname = true;
        let missingFields = '';
        if (!isValidEmail) missingFields += 'email,';
        if (!isValidFullname) missingFields += 'name';

        const newUserId = await this.appleQueries.queryCreateUserWithAppleInfo(
          username,
          isValidEmail ? resolvedEmail : null,
          candidateFullName,
          missingFields !== '' ? missingFields : null,
          appleSub,
          resolvedEmail,
        );
        userId = newUserId;

        if (missingFields !== '') {
          missingFieldsPayload = missingFields.split(',');
        }
      }
    }

    const finalUserId = userId as string;
    const rowsUserData = await this.sessionQueries.queryBumpTokenVersionAndGetSelfData(finalUserId);
    const [{ token_version, user_data: userData }] = rowsUserData;

    if (userData.is_first_login && !missingFieldsPayload) {
      await this.sessionQueries.querySetUserFirstLoginFalse(finalUserId);
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
        tokenVer: token_version,
        ...cnfClaim,
      },
      authConfig.jwtAccessSecret,
      { expiresIn: '5m' },
    );

    const refreshToken = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
        tokenVer: token_version,
        ...cnfClaim,
      },
      authConfig.jwtRefreshSecret,
      { expiresIn: '14d' },
    );

    return {
      message: 'Login successful',
      user: userData.id,
      missingFields: missingFieldsPayload,
      accessToken,
      refreshToken,
    };
  }
}
