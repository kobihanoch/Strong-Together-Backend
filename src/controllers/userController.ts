import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
//import { Expo } from 'expo-server-sdk';
import createError from 'http-errors';
import mime from 'mime';
import path from 'path';
import sql from '../config/db.js';
import { createLogger } from '../config/logger.ts';
import {
  queryAuthenticatedUserById,
  queryDeleteUserById,
  queryGetUserProfilePicURL,
  queryInsertUser,
  queryUpdateAuthenticatedUser,
  queryUpdateUserProfilePicURL,
  queryUserExistsByUsernameOrEmail,
} from '../queries/userQueries.js';
import { sendVerificationEmail, sendVerificationEmailForEmailUpdate } from '../services/emailService.js';
import { deleteFromSupabase, uploadBufferToSupabase } from '../services/supabaseStorageService.js';
import { generateEmailChangeFailedHTML, generateEmailChangeSuccessHTML } from '../templates/responseHTMLTemplates.js';
import {
  CreateUserBody,
  DeleteUserProfilePicBody,
  SaveUserPushTokenBody,
  UpdateUserBody,
} from '../types/api/user/requests.ts';
import {
  CreateUserResponse,
  GetAuthenticatedUserByIdResponse,
  SetProfilePicAndUpdateDBResponse,
  UpdateAuthenticatedUserResponse,
  UserDataResponse,
} from '../types/api/user/responses.ts';
import { ChangeEmailTokenPayload } from '../types/dto/user.dto.ts';
import { cacheStoreJti } from '../utils/cache.js';
import { decodeChangeEmailToken } from '../utils/tokenUtils.js';

//const expo = new Expo();
const logger = createLogger('controller:user');

// ---------- HELPERS -----------------
export const getUserData = async (userId: string): Promise<{ payload: UserDataResponse['user_data'] }> => {
  const rows = await queryAuthenticatedUserById(userId);
  const [user] = rows;
  if (!user) throw createError(404, 'User not found');
  return { payload: user.user_data };
};

export const updateUsersReminderSettingsTimezone = async (userId: string, tz: string): Promise<void> => {
  await sql`update public.user_reminder_settings urs set timezone=${tz}::text where urs.user_id = ${userId}::uuid and urs.timezone is distinct from ${tz}::text;`;
};

// -----------------------------------------------------------

// @desc    Create a new user
// @route   POST /api/users/create
// @access  Public
export const createUser = async (
  req: Request<{}, CreateUserResponse, CreateUserBody>,
  res: Response<CreateUserResponse>,
): Promise<void | Response> => {
  const { username, fullName, email, password, gender } = req.body;
  // Check if user already exists
  const rowsExists = await queryUserExistsByUsernameOrEmail(username, email);
  const [user] = rowsExists;
  if (user) throw createError(400, 'User already exists');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const created = await queryInsertUser(username!, fullName, email!, gender, hash);

  await sendVerificationEmail(email as string, created.id, fullName, {
    ...(req.requestId ? { requestId: req.requestId } : {}),
  });

  return res.status(201).json({ message: 'User created successfully!', user: created });
};

// @desc    Get authenticated user by ID
// @route   GET /api/users/get
// @access  Private
export const getAuthenticatedUserById = async (
  req: Request<{}, GetAuthenticatedUserByIdResponse>,
  res: Response<GetAuthenticatedUserByIdResponse>,
): Promise<Response<GetAuthenticatedUserByIdResponse>> => {
  const { payload } = await getUserData(req.user!.id);
  return res.status(200).json(payload);
};

// @desc    Update authenticated user
// @route   PUT /api/users/updateself
// @access  Private
export const updateAuthenticatedUser = async (
  req: Request<{}, UpdateAuthenticatedUserResponse, UpdateUserBody>,
  res: Response<UpdateAuthenticatedUserResponse>,
): Promise<Response<UpdateAuthenticatedUserResponse>> => {
  const { username, fullName, email } = req.body;
  const { payload: currentUser } = await getUserData(req.user!.id);

  let rowsUpdated: UserDataResponse[];
  try {
    rowsUpdated = await queryUpdateAuthenticatedUser(req.user!.id, { username, fullName, email });
  } catch (e: any) {
    if (e.code === '23505') {
      throw createError(409, 'Username or email already in use');
    }
    throw e;
  }

  const [updated] = rowsUpdated;

  if (!updated) return res.status(404).json({ message: 'User not found' } as any);

  const { user_data: userData } = updated;

  const currentEmail = (currentUser.email || '').trim().toLowerCase();
  const candidate = (email || '').trim().toLowerCase();

  let emailChanged = false;
  if (candidate && candidate !== currentEmail) {
    await sendVerificationEmailForEmailUpdate(candidate, req.user!.id, userData.name || 'there', {
      ...(req.requestId ? { requestId: req.requestId } : {}),
    });
    emailChanged = true;
  }

  return res.status(200).json({
    message: 'User updated successfully',
    emailChanged,
    user: updated.user_data,
  });
};

// @desc    Confirm email change (via link)
// @route   PUT /api/users/changeemail?token=...
// @access  Public (link-based)
export const updateSelfEmail = async (req: Request, res: Response): Promise<Response> => {
  const requestLogger = req.logger || logger;
  const token = req.query?.token as string | undefined;
  if (!token)
    return res
      .status(401)
      .type('html')
      .set('Cache-Control', 'no-store')
      .send(generateEmailChangeFailedHTML('Missing token'));

  const decoded = decodeChangeEmailToken(token) as ChangeEmailTokenPayload | null;
  if (!decoded)
    return res
      .status(401)
      .type('html')
      .set('Cache-Control', 'no-store')
      .send(generateEmailChangeFailedHTML('Invalid or expired link'));

  const { jti, sub, newEmail, exp, iss, typ } = decoded;

  // basic claim validation
  if (iss !== 'strong-together' || typ !== 'email-confirm' || !jti || !sub || !newEmail || !exp) {
    return res
      .status(400)
      .type('html')
      .set('Cache-Control', 'no-store')
      .send(generateEmailChangeFailedHTML('Malformed token'));
  }

  // compute remaining TTL from exp (JWT 'exp' is seconds since epoch)
  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = Math.max(1, exp - nowSec);

  // JTI single-use allow-list
  const inserted = await cacheStoreJti('emailchange', jti, ttlSec);
  if (!inserted) {
    return res
      .status(401)
      .type('html')
      .set('Cache-Control', 'no-store')
      .send(generateEmailChangeFailedHTML('URL already used or expired'));
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
      return res
        .status(409)
        .type('html')
        .set('Cache-Control', 'no-store')
        .send(generateEmailChangeFailedHTML('Email already in use'));
    }
    requestLogger.error({ err: e, event: 'user.email_change_failed', userId: sub }, 'Failed to update user email');
    return res
      .status(500)
      .type('html')
      .set('Cache-Control', 'no-store')
      .send(generateEmailChangeFailedHTML('Server error'));
  }

  // return HTML 200 (not 204)
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).type('html').set('Cache-Control', 'no-store').send(generateEmailChangeSuccessHTML());
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/deleteself
// @access  Private/Admin
export const deleteSelfUser = async (req: Request, res: Response): Promise<Response> => {
  await queryDeleteUserById(req.user!.id);
  return res.json({ message: 'User deleted successfully' });
};

// @desc    Save user's expo push token to DB
// @route   PUT /api/users/pushtoken
// @access  Private
export const saveUserPushToken = async (
  req: Request<{}, {}, SaveUserPushTokenBody>,
  res: Response,
): Promise<Response> => {
  await sql`UPDATE users SET push_token=${req.body.token} WHERE id=${req.user!.id}::uuid`;
  return res.status(204).end();
};

// @desc    Stores profile pic in bucket, and updates user DB to profile pic new URL
// @route   PUT /api/users/setprofilepic
// @access  Private
export const setProfilePicAndUpdateDB = async (
  req: Request<{}, SetProfilePicAndUpdateDBResponse> & { file?: any },
  res: Response<SetProfilePicAndUpdateDBResponse>,
): Promise<Response<SetProfilePicAndUpdateDBResponse>> => {
  if (!req.file) {
    throw createError(400, 'No file provided');
  }

  const userId = req.user!.id;

  // Media params
  const ext = path.extname(req.file.originalname) || `.${mime.getExtension(req.file.mimetype) || 'jpg'}`;
  const key = `${userId}/${Date.now()}${ext}`;

  const { path: newPath, publicUrl } = await uploadBufferToSupabase(
    process.env.BUCKET_NAME as string,
    key,
    req.file.buffer,
    req.file.mimetype,
  );

  // Get last profile pic url to delete
  const [row] = await queryGetUserProfilePicURL(userId);
  const oldPath = row?.profile_image_url;

  // Update user profile url
  await queryUpdateUserProfilePicURL(userId, newPath);

  // Delete last image from bucket
  if (oldPath && oldPath !== newPath) {
    deleteFromSupabase(oldPath).catch((e: any) => {
      (req.logger || logger).warn(
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

  return res.status(201).json({ path: newPath, url: publicUrl, message: 'Upload success' });
};

// @desc    Deletes a pic from bucket and from user DB
// @route   DELETE /api/users/deleteprofilepic
// @access  Private
export const deleteUserProfilePic = async (
  req: Request<{}, {}, DeleteUserProfilePicBody>,
  res: Response,
): Promise<Response> => {
  await deleteFromSupabase(req.body.path);
  // Update user profile url
  await queryUpdateUserProfilePicURL(req.user!.id, null);
  return res.status(200).end();
};
