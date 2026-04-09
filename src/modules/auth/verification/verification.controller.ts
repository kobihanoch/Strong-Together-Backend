import { Request, Response } from 'express';
import type {
  ChangeEmailAndVerifyBody,
  CheckUserVerifyQuery,
  SendVerifcationMailBody,
  VerifyUserAccountQuery,
} from '@strong-together/shared';
import {
  changeEmailAndVerifyData,
  checkUserVerifyData,
  sendVerificationMailData,
  verifyUserAccountData,
} from './verification.service.ts';

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
