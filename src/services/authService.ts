import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import sql from '../config/db.ts';
import {
  queryBumpTokenVersionAndGetSelfData,
  queryBumpTokenVersionAndGetSelfDataCAS,
  querySetUserFirstLoginFalse,
  queryUpdateExpoPushTokenToNull,
  queryUpdateUserPassword,
  queryUpdateUserVerficiationStatus,
  queryUserByIdentifierForLogin,
  queryUserByUsername,
} from '../queries/authQueries.ts';
import { queryUserExistsByUsernameOrEmail } from '../queries/userQueries.js';
import { sendForgotPasswordEmail, sendVerificationEmail } from '../services/emailService.ts';
import { sendSystemMessageToUserWhenFirstLogin } from '../services/messagesService.ts';
import {
  generateVerificationFailedHTML,
  generateVerifiedHTML,
} from '../templates/responseHTMLTemplates.ts';
import type {
  ChangeEmailAndVerifyBody,
  SendChangePassEmailBody,
  SendVerifcationMailBody,
} from '../types/api/auth/requests.ts';
import type {
  LoginResponse,
  RefreshTokenResponse,
  ResetPasswordResponse,
} from '../types/api/auth/responses.ts';
import type { AccessTokenPayload } from '../types/dto/auth.dto.ts';
import { cacheStoreJti } from '../utils/cache.ts';
import {
  decodeForgotPasswordToken,
  decodeRefreshToken,
  decodeVerifyToken,
} from '../utils/tokenUtils.js';

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

export const verifyUserAccountData = async (
  token: string | undefined,
): Promise<{ statusCode: number; html: string }> => {
  if (!token) throw createError(400, 'Missing token');
  const decoded = decodeVerifyToken(token);
  if (!decoded) {
    return { statusCode: 401, html: generateVerificationFailedHTML() };
  }

  const { jti, sub, exp, iss, typ } = decoded;
  if (iss !== 'strong-together' || typ !== 'email-verify' || !jti || !sub) {
    return { statusCode: 400, html: generateVerificationFailedHTML() };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = Math.max(1, exp - nowSec);

  const inserted = await cacheStoreJti('accountverify', jti, ttlSec);
  if (!inserted) {
    return { statusCode: 401, html: generateVerificationFailedHTML() };
  }

  await queryUpdateUserVerficiationStatus(sub, true);
  return { statusCode: 200, html: generateVerifiedHTML() };
};

export const sendVerificationMailData = async (
  body: SendVerifcationMailBody,
  requestId?: string,
): Promise<void> => {
  const { email } = body;
  const [user = null] = await sql<{ id: string; name: string | null; username: string }[]>`
    SELECT id, name, username FROM users WHERE email=${email}`;
  if (!user) return;
  const { id, name } = user;
  await sendVerificationEmail(email, id, name ?? user.username, {
    ...(requestId ? { requestId } : {}),
  });
};

export const changeEmailAndVerifyData = async (
  body: ChangeEmailAndVerifyBody,
  requestId?: string,
): Promise<void> => {
  const { username, password, newEmail } = body;

  const [user = null] = await queryUserByUsername(username);
  if (!user) throw createError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.password!);
  if (!ok) throw createError(401, 'Invalid credentials');

  if (user.is_verified) throw createError(400, 'Account already verified');

  const [exists] = await queryUserExistsByUsernameOrEmail(null, newEmail);
  if (exists) throw createError(409, 'Email already in use');

  await sql`UPDATE users SET email = ${newEmail} WHERE id = ${user.id}::uuid`;
  await sendVerificationEmail(newEmail, user.id, user.name ? user.name : user.username!, {
    ...(requestId ? { requestId } : {}),
  });
};

export const checkUserVerifyData = async (username: string): Promise<{ isVerified: boolean }> => {
  const [user] = await sql<
    { is_verified: boolean }[]
  >`SELECT is_verified FROM users WHERE username=${username}`;
  return { isVerified: user?.is_verified ?? false };
};

export const sendChangePassEmailData = async (
  body: SendChangePassEmailBody,
  requestId?: string,
): Promise<void> => {
  const { identifier } = body;
  if (!identifier) throw createError(400, 'Please fill username or email');
  const [user = null] = await sql<
    { id: string; email: string; name: string; username: string }[]
  >`SELECT id, email, name, username FROM users WHERE 
      auth_provider='app' 
      AND (username=${identifier} OR email=${identifier}) LIMIT 1`;
  if (!user) return;

  await sendForgotPasswordEmail(user.email, user.id, user.name ? user.name : user.username, {
    ...(requestId ? { requestId } : {}),
  });
};

export const resetPasswordData = async (
  token: string | undefined,
  newPassword: string,
): Promise<ResetPasswordResponse> => {
  if (!token) throw createError(400, 'Missing token');
  const decoded = decodeForgotPasswordToken(token);
  if (!decoded) {
    throw createError(400, 'Verfication token is not valid');
  }

  const { jti, sub, exp, iss, typ } = decoded;
  if (iss !== 'strong-together' || typ !== 'forgot-pass' || !jti || !sub) {
    throw createError(400, 'Verfication token is not valid');
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = Math.max(1, exp - nowSec);

  const inserted = await cacheStoreJti('forgotpassword', jti, ttlSec);
  if (!inserted) {
    throw createError(400, 'URL already used or expired');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  await Promise.all([queryUpdateUserPassword(sub, hash), queryBumpTokenVersionAndGetSelfData(sub)]);
  return { ok: true };
};
