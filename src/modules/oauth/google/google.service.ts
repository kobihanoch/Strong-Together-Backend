import { BadRequestException, Injectable } from '@nestjs/common';
import type { GoogleOAuthBody, GoogleTokenVerificationResult, OAuthLoginResponse } from '@strong-together/shared';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config';
import type { AppLogger } from '../../../infrastructure/logger';
import { SessionQueries } from '../../auth/session/session.queries';
import { SystemMessagesService } from '../../messages/system-messages/system-messages.service';
import { buildCnfClaim } from '../oauth.utils';
import { GoogleQueries } from './google.queries';
import { verifyGoogleIdToken } from './google.utils';
@Injectable()
export class GoogleService {
  constructor(
    private readonly systemMessagesService: SystemMessagesService,
    private readonly sessionQueries: SessionQueries,
    private readonly googleQueries: GoogleQueries,
  ) {}

  async createOrSignInWithGoogleData(
    body: GoogleOAuthBody,
    jkt: string,
    requestLogger: AppLogger,
  ): Promise<OAuthLoginResponse> {
    const idToken = body.idToken;

    if (!idToken) throw new BadRequestException('Missing google id token');
    const { googleSub, email, emailVerified, fullName } = (await verifyGoogleIdToken(
      idToken,
    )) as GoogleTokenVerificationResult;

    let { userId, missing_fields } = await this.googleQueries.queryFindUserIdWithGoogleUserId(googleSub);
    const userExistOnOAuthUsers = !!userId;
    let missingFieldsPayload = null;
    if (userExistOnOAuthUsers && missing_fields) missingFieldsPayload = missing_fields.split(',');

    if (!userExistOnOAuthUsers) {
      let isLinked = false;
      requestLogger.info(
        { event: 'oauth.google_link_attempt_started', emailVerified },
        'Google OAuth user not found, trying to link',
      );
      if (emailVerified) {
        const { userId: userIdFromLink } = await this.googleQueries.queryTryToLinkUserWithEmailGoogle(email, googleSub);
        if (userIdFromLink) {
          userId = userIdFromLink;
          isLinked = true;
          requestLogger.info({ event: 'oauth.google_link_succeeded', userId }, 'Google OAuth user linked successfully');
        }
      }

      if (!isLinked) {
        requestLogger.info(
          { event: 'oauth.google_registration_started' },
          'Google OAuth link failed, creating a new user',
        );
        const username = email?.split('@')[0].toLowerCase() || null;

        const isValidEmail = !!email;
        const isValidFullname = true;
        let missingFields = '';
        if (!isValidEmail) missingFields += 'email,';
        if (!isValidFullname) missingFields += 'name';

        const userIdFromRegister = await this.googleQueries.queryCreateUserWithGoogleInfo(
          username,
          isValidEmail ? email : null,
          fullName,
          missingFields !== '' ? missingFields : null,
          googleSub,
          email,
        );
        userId = userIdFromRegister;

        requestLogger.info({ event: 'oauth.google_registration_completed', userId }, 'Google OAuth user created');

        if (missingFields !== '') missingFieldsPayload = missingFields.split(',');
      }
    }

    const finalUserId = userId as string;
    requestLogger.info(
      { event: 'oauth.google_login_completed', userId: finalUserId },
      'Google OAuth user authenticated',
    );

    const rowsUserData = await this.sessionQueries.queryBumpTokenVersionAndGetSelfData(finalUserId);
    const [{ token_version, user_data: userData }] = rowsUserData;
    if (userData.is_first_login && !missingFieldsPayload) {
      await this.sessionQueries.querySetUserFirstLoginFalse(finalUserId);
      try {
        await this.systemMessagesService.sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name as string);
      } catch (e) {
        requestLogger.error(
          { err: e, event: 'oauth.google_first_login_message_failed', userId: userData.id },
          'Failed to send Google OAuth first-login message',
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
