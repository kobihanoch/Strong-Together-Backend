import { Request, Response } from 'express';
import { createLogger } from '../../config/logger.ts';
import {
  changeEmailAndVerifyData,
  checkUserVerifyData,
  loginUserData,
  logoutUserData,
  refreshAccessTokenData,
  resetPasswordData,
  sendChangePassEmailData,
  sendVerificationMailData,
  verifyUserAccountData,
} from './authService.ts';
import {
  ChangeEmailAndVerifyBody,
  CheckUserVerifyQuery,
  LoginRequestBody,
  ResetPasswordBody,
  ResetPasswordQuery,
  SendChangePassEmailBody,
  SendVerifcationMailBody,
  VerifyUserAccountQuery,
} from '../../types/api/auth/requests.ts';
import {
  LoginResponse,
  MessageResponse,
  RefreshTokenResponse,
  ResetPasswordResponse,
} from '../../types/api/auth/responses.ts';
import { getRefreshToken } from '../../utils/tokenUtils.js';

const logger = createLogger('controller:auth');

/**
 * Authenticate a user with credentials and issue fresh access tokens.
 *
 * Validates the submitted credentials, enforces DPoP key binding when enabled,
 * performs first-login side effects when needed, and returns a fresh access and
 * refresh token pair.
 *
 * Route: POST /api/auth/login
 * Access: Public
 */
export const loginUser = async (
  req: Request<{}, LoginResponse, LoginRequestBody>,
  res: Response<LoginResponse>,
): Promise<Response<LoginResponse>> => {
  const requestLogger = req.logger || logger;
  const { identifier, password } = req.body;
  const jkt = req.headers['dpop-key-binding'] as string | undefined;
  const payload = await loginUserData(identifier, password, jkt, requestLogger);

  res.set('Cache-Control', 'no-store');
  return res.status(200).json(payload);
};

/**
 * Invalidate the authenticated user's current session.
 *
 * Decodes the submitted refresh token when present, clears the stored push
 * token, bumps token version state, and returns a success message.
 *
 * Route: POST /api/auth/logout
 * Access: User
 */
export const logoutUser = async (
  req: Request<{}, MessageResponse>,
  res: Response<MessageResponse>,
): Promise<Response<MessageResponse>> => {
  const refreshToken = getRefreshToken(req);
  await logoutUserData(refreshToken);
  return res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Refresh the caller's token pair using a valid refresh token.
 *
 * Validates the refresh token, enforces DPoP proof binding when enabled,
 * rotates token version state, and returns a fresh access and refresh token
 * pair.
 *
 * Route: POST /api/auth/refresh
 * Access: Public
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response<RefreshTokenResponse>,
): Promise<Response<RefreshTokenResponse>> => {
  const dpopJkt = req.dpopJkt;
  const refreshToken = getRefreshToken(req);
  const payload = await refreshAccessTokenData(refreshToken, dpopJkt);

  res.set('Cache-Control', 'no-store');
  return res.status(200).json(payload);
};

/**
 * Complete account verification from an email verification link.
 *
 * Validates the verification token, enforces single-use semantics through the
 * JTI cache, updates the user's verification state, and returns an HTML result
 * page.
 *
 * Route: GET /api/auth/verify
 * Access: Public
 */
export const verifyUserAccount = async (
  req: Request<{}, any, any, VerifyUserAccountQuery>,
  res: Response,
): Promise<any> => {
  const { statusCode, html } = await verifyUserAccountData(req.query.token);
  return res.status(statusCode).type('html').set('Cache-Control', 'no-store').send(html);
};

/**
 * Send a new verification email when the submitted address belongs to a user.
 *
 * Resolves the user by email and, when found, dispatches a fresh verification
 * email without exposing whether the address exists.
 *
 * Route: POST /api/auth/sendverificationemail
 * Access: Public
 */
export const sendVerificationMail = async (
  req: Request<{}, any, SendVerifcationMailBody>,
  res: Response,
): Promise<any> => {
  await sendVerificationMailData(req.body, req.requestId);
  return res.status(204).end();
};

/**
 * Change the email address of an unverified account and send a new verification email.
 *
 * Re-authenticates the caller with username and password, updates the pending
 * email address when allowed, and dispatches a fresh verification email to the
 * new address.
 *
 * Route: PUT /api/auth/changeemailverify
 * Access: Public
 */
export const changeEmailAndVerify = async (
  req: Request<{}, any, ChangeEmailAndVerifyBody>,
  res: Response,
): Promise<any> => {
  await changeEmailAndVerifyData(req.body, req.requestId);
  return res.status(204).end();
};

/**
 * Check whether a username belongs to a verified account.
 *
 * Returns a minimal verification-state payload for the supplied username.
 *
 * Route: GET /api/auth/checkuserverify
 * Access: Public
 */
export const checkUserVerify = async (
  req: Request<{}, any, any, CheckUserVerifyQuery>,
  res: Response<{ isVerified: boolean }>,
): Promise<Response<{ isVerified: boolean }>> => {
  const payload = await checkUserVerifyData(req.query.username);
  return res.status(200).json(payload);
};

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
