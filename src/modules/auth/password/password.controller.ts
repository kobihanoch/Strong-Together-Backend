import { Request, Response } from 'express';
import {
  ResetPasswordBody,
  ResetPasswordQuery,
  SendChangePassEmailBody,
} from '../../../types/api/auth/requests.ts';
import { ResetPasswordResponse } from '../../../types/api/auth/responses.ts';
import {
  resetPasswordData,
  sendChangePassEmailData,
} from './password.service.ts';

/**
 * Send a password-reset email when the submitted identifier matches an app user.
 *
 * Accepts a username or email address and dispatches a reset email without
 * revealing whether the account exists.
 *
 * Route: POST /api/auth/forgotpassemail
 * Access: Public
 */
export const sendChangePassEmail = async (
  req: Request<{}, any, SendChangePassEmailBody>,
  res: Response,
): Promise<any> => {
  await sendChangePassEmailData(req.body, req.requestId);
  return res.status(204).end();
};

/**
 * Reset a user's password from a password-reset link.
 *
 * Validates the reset token, enforces one-time use through the JTI cache,
 * updates the stored password hash, and invalidates older sessions by bumping
 * token version state.
 *
 * Route: PUT /api/auth/resetpassword
 * Access: Public
 */
export const resetPassword = async (
  req: Request<{}, ResetPasswordResponse, ResetPasswordBody, ResetPasswordQuery>,
  res: Response<ResetPasswordResponse>,
): Promise<Response<ResetPasswordResponse>> => {
  const payload = await resetPasswordData(req.query.token, req.body.newPassword);
  return res.status(200).json(payload);
};
