import createError from 'http-errors';
import mime from 'mime';
import path from 'path';
import { supabaseConfig } from '../../../config/storage.config.ts';
import sql from '../../../infrastructure/db.client.ts';
import {
  queryAuthenticatedUserById,
  queryDeleteUserById,
  queryGetUserProfilePicURL,
  queryUpdateAuthenticatedUser,
  queryUpdateUserProfilePicURL,
} from './update.queries.ts';
import { sendVerificationEmailForEmailUpdate } from '../../../shared/services/email-service.ts';
import { deleteFromSupabase, uploadBufferToSupabase } from '../../../shared/services/supabase-storage-service.ts';
import {
  generateEmailChangeFailedHTML,
  generateEmailChangeSuccessHTML,
} from '../../../shared/templates/response-html-templates.ts';
import type { DeleteUserProfilePicBody, UpdateUserBody } from '../../../shared/types/api/user/requests.ts';
import type {
  SetProfilePicAndUpdateDBResponse,
  UpdateAuthenticatedUserResponse,
  UserDataResponse,
} from '../../../shared/types/api/user/responses.ts';
import type { ChangeEmailTokenPayload } from '../../../shared/types/dto/user.dto.ts';
import { cacheStoreJti } from '../../../shared/utils/cache.ts';
import { decodeChangeEmailToken } from '../../../shared/utils/token-utils.ts';

export const getUserData = async (userId: string): Promise<{ payload: UserDataResponse['user_data'] }> => {
  const rows = await queryAuthenticatedUserById(userId);
  const [user] = rows;
  if (!user) throw createError(404, 'User not found');
  return { payload: user.user_data };
};

export const updateUsersReminderSettingsTimezone = async (userId: string, tz: string): Promise<void> => {
  await sql`update public.user_reminder_settings urs set timezone=${tz}::text where urs.user_id = ${userId}::uuid and urs.timezone is distinct from ${tz}::text;`;
};

export const updateAuthenticatedUserData = async (
  userId: string,
  body: UpdateUserBody,
  requestId?: string,
): Promise<UpdateAuthenticatedUserResponse> => {
  const { username, fullName, email } = body;
  const { payload: currentUser } = await getUserData(userId);

  let rowsUpdated: UserDataResponse[];
  try {
    rowsUpdated = await queryUpdateAuthenticatedUser(userId, { username, fullName, email });
  } catch (e: any) {
    if (e.code === '23505') {
      throw createError(409, 'Username or email already in use');
    }
    throw e;
  }

  const [updated] = rowsUpdated;
  if (!updated) return { message: 'User not found' } as any;

  const { user_data: userData } = updated;
  const currentEmail = (currentUser.email || '').trim().toLowerCase();
  const candidate = (email || '').trim().toLowerCase();

  let emailChanged = false;
  if (candidate && candidate !== currentEmail) {
    await sendVerificationEmailForEmailUpdate(candidate, userId, userData.name || 'there', {
      ...(requestId ? { requestId } : {}),
    });
    emailChanged = true;
  }

  return {
    message: 'User updated successfully',
    emailChanged,
    user: updated.user_data,
  };
};

export const updateSelfEmailData = async (
  token: string | undefined,
  requestLogger: { warn: (...args: any[]) => void; error: (...args: any[]) => void },
): Promise<{ statusCode: number; html: string }> => {
  if (!token) return { statusCode: 401, html: generateEmailChangeFailedHTML('Missing token') };

  const decoded = decodeChangeEmailToken(token) as ChangeEmailTokenPayload | null;
  if (!decoded) {
    return { statusCode: 401, html: generateEmailChangeFailedHTML('Invalid or expired link') };
  }

  const { jti, sub, newEmail, exp, iss, typ } = decoded;
  if (iss !== 'strong-together' || typ !== 'email-confirm' || !jti || !sub || !newEmail || !exp) {
    return { statusCode: 400, html: generateEmailChangeFailedHTML('Malformed token') };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = Math.max(1, exp - nowSec);
  const inserted = await cacheStoreJti('emailchange', jti, ttlSec);
  if (!inserted) {
    return { statusCode: 401, html: generateEmailChangeFailedHTML('URL already used or expired') };
  }

  const normalized = newEmail.trim().toLowerCase();

  try {
    await sql.begin(async (trx) => {
      await trx`
        UPDATE users
        SET email = ${normalized}
        WHERE id = ${sub}::uuid
      `;
    });
  } catch (e: any) {
    if (e.code === '23505') {
      requestLogger.warn({ event: 'user.email_change_conflict', userId: sub }, 'Email already in use');
      return { statusCode: 409, html: generateEmailChangeFailedHTML('Email already in use') };
    }
    requestLogger.error({ err: e, event: 'user.email_change_failed', userId: sub }, 'Failed to update user email');
    return { statusCode: 500, html: generateEmailChangeFailedHTML('Server error') };
  }

  return { statusCode: 200, html: generateEmailChangeSuccessHTML() };
};

export const deleteSelfUserData = async (userId: string): Promise<void> => {
  await queryDeleteUserById(userId);
};

export const setProfilePicAndUpdateDBData = async (
  userId: string,
  file: any,
  requestLogger: { warn: (...args: any[]) => void },
): Promise<SetProfilePicAndUpdateDBResponse> => {
  if (!file) throw createError(400, 'No file provided');

  const ext = path.extname(file.originalname) || `.${mime.getExtension(file.mimetype) || 'jpg'}`;
  const key = `${userId}/${Date.now()}${ext}`;

  const { path: newPath, publicUrl } = await uploadBufferToSupabase(
    supabaseConfig.bucketName,
    key,
    file.buffer,
    file.mimetype,
  );

  const [row] = await queryGetUserProfilePicURL(userId);
  const oldPath = row?.profile_image_url;
  await queryUpdateUserProfilePicURL(userId, newPath);

  if (oldPath && oldPath !== newPath) {
    deleteFromSupabase(oldPath).catch((e: any) => {
      requestLogger.warn(
        {
          err: e,
          event: 'user.old_profile_image_delete_failed',
          userId,
          oldPath,
          responseData: e?.response?.data,
        },
        'Failed to delete old profile image',
      );
    });
  }

  return { path: newPath, url: publicUrl, message: 'Upload success' };
};

export const deleteUserProfilePicData = async (userId: string, body: DeleteUserProfilePicBody): Promise<void> => {
  await deleteFromSupabase(body.path);
  await queryUpdateUserProfilePicURL(userId, null);
};
