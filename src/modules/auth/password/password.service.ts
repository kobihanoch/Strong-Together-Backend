import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import sql from '../../../infrastructure/db.client.ts';
import { queryBumpTokenVersionAndGetSelfData, queryUpdateUserPassword } from './password.queries.ts';
import { sendForgotPasswordEmail } from './password-emails/password-emails.service.ts';
import type { ResetPasswordResponse, SendChangePassEmailBody } from '@strong-together/shared';
import { decodeForgotPasswordToken } from './password.utils.ts';
import { cacheStoreJti } from '../../../infrastructure/cache/redis.cache.ts';

export const sendChangePassEmailData = async (body: SendChangePassEmailBody, requestId?: string): Promise<void> => {
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

