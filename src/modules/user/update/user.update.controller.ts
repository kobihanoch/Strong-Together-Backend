import { Request, Response } from 'express';
import { createLogger } from '../../../config/logger.ts';
import {
  deleteSelfUserData,
  deleteUserProfilePicData,
  getUserData,
  setProfilePicAndUpdateDBData,
  updateAuthenticatedUserData,
  updateSelfEmailData,
} from './user.update.service.ts';
import { DeleteUserProfilePicBody, UpdateUserBody } from '../../../types/api/user/requests.ts';
import {
  GetAuthenticatedUserByIdResponse,
  SetProfilePicAndUpdateDBResponse,
  UpdateAuthenticatedUserResponse,
} from '../../../types/api/user/responses.ts';

const logger = createLogger('controller:user');

/**
 * Get the authenticated user's profile.
 *
 * Returns the current user's persisted profile payload.
 *
 * Route: GET /api/users/get
 * Access: User
 */
export const getAuthenticatedUserById = async (
  req: Request<{}, GetAuthenticatedUserByIdResponse>,
  res: Response<GetAuthenticatedUserByIdResponse>,
): Promise<Response<GetAuthenticatedUserByIdResponse>> => {
  const { payload } = await getUserData(req.user!.id);
  return res.status(200).json(payload);
};

/**
 * Update the authenticated user's profile details.
 *
 * Persists allowed profile fields and sends an email-verification flow when
 * the submitted email differs from the current one.
 *
 * Route: PUT /api/users/updateself
 * Access: User
 */
export const updateAuthenticatedUser = async (
  req: Request<{}, UpdateAuthenticatedUserResponse, UpdateUserBody>,
  res: Response<UpdateAuthenticatedUserResponse>,
): Promise<Response<UpdateAuthenticatedUserResponse>> => {
  const payload = await updateAuthenticatedUserData(req.user!.id, req.body, req.requestId);

  if (payload.message === 'User not found') {
    return res.status(404).json(payload as any);
  }

  return res.status(200).json(payload);
};

/**
 * Confirm a pending email change from a signed email link.
 *
 * Validates the signed change-email token, enforces one-time use, updates the
 * email address, and returns an HTML result page.
 *
 * Route: GET /api/users/changeemail
 * Access: Public
 */
export const updateSelfEmail = async (req: Request, res: Response): Promise<Response> => {
  const requestLogger = req.logger || logger;
  const { statusCode, html } = await updateSelfEmailData(req.query?.token as string | undefined, requestLogger);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(statusCode).type('html').set('Cache-Control', 'no-store').send(html);
};

/**
 * Delete the authenticated user's account.
 *
 * Removes the current user's account and returns a success message.
 *
 * Route: DELETE /api/users/deleteself
 * Access: User
 */
export const deleteSelfUser = async (req: Request, res: Response): Promise<Response> => {
  await deleteSelfUserData(req.user!.id);
  return res.json({ message: 'User deleted successfully' });
};

/**
 * Upload a new profile image for the authenticated user.
 *
 * Stores the uploaded image in Supabase Storage, updates the user's profile
 * image path, and schedules cleanup of the previous image when applicable.
 *
 * Route: PUT /api/users/setprofilepic
 * Access: User
 */
export const setProfilePicAndUpdateDB = async (
  req: Request<{}, SetProfilePicAndUpdateDBResponse> & { file?: any },
  res: Response<SetProfilePicAndUpdateDBResponse>,
): Promise<Response<SetProfilePicAndUpdateDBResponse>> => {
  const payload = await setProfilePicAndUpdateDBData(req.user!.id, req.file, req.logger || logger);
  return res.status(201).json(payload);
};

/**
 * Delete the authenticated user's profile image.
 *
 * Removes the stored image from object storage and clears the profile image
 * reference from the user's record.
 *
 * Route: DELETE /api/users/deleteprofilepic
 * Access: User
 */
export const deleteUserProfilePic = async (
  req: Request<{}, {}, DeleteUserProfilePicBody>,
  res: Response,
): Promise<Response> => {
  await deleteUserProfilePicData(req.user!.id, req.body);
  return res.status(200).end();
};
