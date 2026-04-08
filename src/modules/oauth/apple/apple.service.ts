import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config.ts';
import {
  queryBumpTokenVersionAndGetSelfData,
  querySetUserFirstLoginFalse,
} from '../../auth/session/session.queries.ts';
import {
  queryCreateUserWithAppleInfo,
  queryFindUserIdWithAppleUserId,
  queryTryToLinkUserWithEmailApple,
} from './apple.queries.ts';
import { buildCnfClaim } from '../oauth.utils.ts';
import { sendSystemMessageToUserWhenFirstLogin } from '../../../shared/services/messages-service.ts';
import type { AppleOAuthBody } from '../../../shared/types/api/oAuth/requests.ts';
import type { OAuthLoginResponse } from '../../../shared/types/api/oAuth/responses.ts';
import { verifyAppleIdToken } from './apple.utils.ts';

export const createOrSignInWithAppleData = async (
  body: AppleOAuthBody,
  jkt: string,
  requestLogger: { error: (...args: any[]) => void },
): Promise<OAuthLoginResponse> => {
  const { idToken, rawNonce, name, email } = body || {};

  if (!idToken || typeof idToken !== 'string') {
    throw createError(400, 'Missing or invalid Apple identityToken');
  }
  if (!rawNonce || typeof rawNonce !== 'string') {
    throw createError(400, 'Missing rawNonce');
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

  let { userId, missing_fields } = await queryFindUserIdWithAppleUserId(appleSub);
  const userExistOnOAuthUsers = !!userId;

  let missingFieldsPayload = null;
  if (userExistOnOAuthUsers && missing_fields) {
    missingFieldsPayload = missing_fields.split(',');
  }

  if (!userExistOnOAuthUsers) {
    let isLinked = false;

    if (emailVerified && resolvedEmail) {
      const { userId: linkedId } = await queryTryToLinkUserWithEmailApple(resolvedEmail, appleSub);
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

      const newUserId = await queryCreateUserWithAppleInfo(
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
  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(finalUserId);
  const [{ token_version, user_data: userData }] = rowsUserData;

  if (userData.is_first_login && !missingFieldsPayload) {
    await querySetUserFirstLoginFalse(finalUserId);
    try {
      await sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name as string);
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
};
