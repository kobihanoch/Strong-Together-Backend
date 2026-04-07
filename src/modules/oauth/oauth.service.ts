import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import sql from '../../config/db.ts';
import { queryBumpTokenVersionAndGetSelfData, querySetUserFirstLoginFalse } from '../auth/session/session.queries.ts';
import { sendSystemMessageToUserWhenFirstLogin } from '../../services/messagesService.ts';
import type { ProceedLoginResponse } from '../../types/api/oAuth/responses.ts';

export const validateJkt = (jkt: string | undefined): string => {
  if (process.env.DPOP_ENABLED === 'true') {
    if (!jkt) {
      throw createError(400, 'DPoP-Key-Binding header is missing.');
    }
  }

  return jkt as string;
};

export const buildCnfClaim = (jkt: string) => ({
  cnf: {
    jkt: jkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
  },
});

export const proceedLoginData = async (
  userId: string,
  dpopJkt: string | undefined,
  requestLogger: { error: (...args: any[]) => void },
): Promise<ProceedLoginResponse> => {
  if (process.env.DPOP_ENABLED === 'true' && !dpopJkt) {
    throw createError(500, 'Internal error: DPoP JKT not found on request.');
  }

  const [{ missing_fields }] = await sql<{ missing_fields: string | null }[]>`
    SELECT missing_fields FROM oauth_accounts WHERE user_id=${userId}::uuid `;

  if (missing_fields) {
    throw createError(409, 'Profile not completed yet');
  }

  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(userId);
  const [{ token_version, user_data: userData }] = rowsUserData;
  if (userData.is_first_login) {
    await querySetUserFirstLoginFalse(userId);
    try {
      await sendSystemMessageToUserWhenFirstLogin(userData.id, userData.name as string);
    } catch (e) {
      requestLogger.error(
        { err: e, event: 'oauth.proceed_first_login_message_failed', userId: userData.id },
        'Failed to send proceed-login first-login message',
      );
    }
  }

  const cnfClaim = dpopJkt ? buildCnfClaim(dpopJkt) : {};

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
    accessToken,
    refreshToken,
  };
};
