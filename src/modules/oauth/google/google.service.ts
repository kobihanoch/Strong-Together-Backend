import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { queryBumpTokenVersionAndGetSelfData, querySetUserFirstLoginFalse } from '../../auth/session/session.queries.ts';
import {
  queryCreateUserWithGoogleInfo,
  queryFindUserIdWithGoogleUserId,
  queryTryToLinkUserWithEmailGoogle,
} from './google.queries.ts';
import { buildCnfClaim } from '../oauth.service.ts';
import { sendSystemMessageToUserWhenFirstLogin } from '../../../services/messagesService.ts';
import type { GoogleOAuthBody } from '../../../types/api/oAuth/requests.ts';
import type { OAuthLoginResponse } from '../../../types/api/oAuth/responses.ts';
import type { GoogleTokenVerificationResult } from '../../../types/dto/oAuth.dto.ts';
import { verifyGoogleIdToken } from '../../../utils/oauthUtils.ts';

export const createOrSignInWithGoogleData = async (
  body: GoogleOAuthBody,
  jkt: string,
  requestLogger: { info: (...args: any[]) => void; error: (...args: any[]) => void },
): Promise<OAuthLoginResponse> => {
  const idToken = body.idToken;

  if (!idToken) throw createError(400, 'Missing google id token');
  const { googleSub, email, emailVerified, fullName } = (await verifyGoogleIdToken(
    idToken,
  )) as GoogleTokenVerificationResult;

  let { userId, missing_fields } = await queryFindUserIdWithGoogleUserId(googleSub);
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
      const { userId: userIdFromLink } = await queryTryToLinkUserWithEmailGoogle(email, googleSub);
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

      const userIdFromRegister = await queryCreateUserWithGoogleInfo(
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
  requestLogger.info({ event: 'oauth.google_login_completed', userId: finalUserId }, 'Google OAuth user authenticated');

  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(finalUserId);
  const [{ token_version, user_data: userData }] = rowsUserData;
  if (userData.is_first_login && !missingFieldsPayload) {
    await querySetUserFirstLoginFalse(finalUserId);
    try {
      await sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name as string);
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
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '5m' },
  );

  const refreshToken = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '14d' },
  );

  return {
    message: 'Login successful',
    user: userData.id,
    missingFields: missingFieldsPayload,
    accessToken,
    refreshToken,
  };
};
