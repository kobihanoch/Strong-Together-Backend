import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import {
  queryBumpTokenVersionAndGetSelfData,
  queryBumpTokenVersionAndGetSelfDataCAS,
  querySetUserFirstLoginFalse,
  queryUpdateExpoPushTokenToNull,
  queryUserByIdentifierForLogin,
} from '../auth.session.queries.ts';
import { sendSystemMessageToUserWhenFirstLogin } from '../../../services/messagesService.ts';
import type {
  LoginResponse,
  RefreshTokenResponse,
} from '../../../types/api/auth/responses.ts';
import type { AccessTokenPayload } from '../../../types/dto/auth.dto.ts';
import { decodeRefreshToken } from '../../../utils/tokenUtils.js';

export const loginUserData = async (
  identifier: string,
  password: string,
  jkt: string | undefined,
  requestLogger: { error: (...args: any[]) => void },
): Promise<LoginResponse> => {
  if (process.env.DPOP_ENABLED === 'true') {
    if (!jkt) {
      throw createError(400, 'DPoP-Key-Binding header is missing.');
    }
  }

  const [user = null] = await queryUserByIdentifierForLogin(identifier);
  if (!user) throw createError(401, 'Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) throw createError(401, 'Invalid credentials');

  if (!user.is_verified) {
    throw createError(401, 'You need to verify you account');
  }

  if (user.is_first_login) {
    await querySetUserFirstLoginFalse(user.id);
    try {
      await sendSystemMessageToUserWhenFirstLogin(user.id, user.name!);
    } catch (e) {
      requestLogger.error({ err: e, event: 'auth.first_login_message_failed', userId: user.id }, 'Failed to send first-login message');
    }
  }

  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(user.id);
  const [{ token_version, user_data: userData }] = rowsUserData;

  const cnfClaim = jkt
    ? {
        cnf: {
          jkt: jkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
        },
      }
    : {};

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
    user: userData?.id,
    accessToken,
    refreshToken,
  };
};

export const logoutUserData = async (refreshToken: string | null | undefined): Promise<void> => {
  const decodedRefresh = decodeRefreshToken(refreshToken ?? null) as AccessTokenPayload | null;

  if (decodedRefresh) {
    await Promise.all([
      queryUpdateExpoPushTokenToNull(decodedRefresh.id),
      queryBumpTokenVersionAndGetSelfData(decodedRefresh.id),
    ]);
  }
};

export const refreshAccessTokenData = async (
  refreshToken: string | null | undefined,
  dpopJkt: string | null | undefined,
): Promise<RefreshTokenResponse> => {
  if (process.env.DPOP_ENABLED === 'true') {
    if (!dpopJkt) {
      throw createError(500, 'Internal error: DPoP JKT not found on request.');
    }
  }

  if (!refreshToken) throw createError(401, 'No refresh token provided');

  const decoded = decodeRefreshToken(refreshToken ?? null) as AccessTokenPayload | null;
  if (!decoded) throw createError(401, 'Invalid or expired refresh token');

  if (process.env.DPOP_ENABLED === 'true') {
    const tokenJkt = decoded.cnf?.jkt;
    if (tokenJkt && tokenJkt !== dpopJkt) {
      throw createError(401, 'Proof-of-Possession failed (JKT mismatch).');
    }
  }

  const [user = null] = await queryBumpTokenVersionAndGetSelfDataCAS(decoded.id, decoded.tokenVer);
  if (!user) throw createError(401, 'New login required');

  const { token_version, user_data: userData } = user;

  const cnfClaim = dpopJkt
    ? {
        cnf: {
          jkt: dpopJkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
        },
      }
    : {};

  const newAccess = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '5m' },
  );

  const newRefresh = jwt.sign(
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
    message: 'Access token refreshed',
    accessToken: newAccess,
    refreshToken: newRefresh,
    userId: userData.id,
  };
};
