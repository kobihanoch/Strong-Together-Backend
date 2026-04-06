import { Request, Response } from 'express';
import { createLogger } from '../../config/logger.ts';
import {
  createOrSignInWithAppleData,
  createOrSignInWithGoogleData,
  proceedLoginData,
  validateJkt,
} from './oauth.service.ts';
import { AppleOAuthBody, GoogleOAuthBody } from '../../types/api/oAuth/requests.ts';
import { OAuthLoginResponse, ProceedLoginResponse } from '../../types/api/oAuth/responses.ts';
const logger = createLogger('controller:oauth');

/**
 * Authenticate or register a user with Google OAuth.
 *
 * Verifies the Google identity token, links or creates the local user record as
 * needed, and returns the session payload.
 *
 * Route: POST /api/oauth/google
 * Access: Public
 */
export const createOrSignInWithGoogle = async (
  req: Request<{}, OAuthLoginResponse, GoogleOAuthBody>,
  res: Response<OAuthLoginResponse>,
): Promise<Response<OAuthLoginResponse>> => {
  const requestLogger = req.logger || logger;
  const jkt = validateJkt(req.headers['dpop-key-binding'] as string | undefined);
  const payload = await createOrSignInWithGoogleData(req.body, jkt, requestLogger);

  res.set('Cache-Control', 'no-store');
  return res.status(200).json(payload);
};

/**
 * Authenticate or register a user with Apple OAuth.
 *
 * Verifies the Apple identity token, links or creates the local user record as
 * needed, and returns the session payload.
 *
 * Route: POST /api/oauth/apple
 * Access: Public
 */
export const createOrSignInWithApple = async (
  req: Request<{}, OAuthLoginResponse, AppleOAuthBody>,
  res: Response<OAuthLoginResponse>,
): Promise<Response<OAuthLoginResponse>> => {
  const requestLogger = req.logger || logger;
  const jkt = validateJkt(req.headers['dpop-key-binding'] as string | undefined);
  const payload = await createOrSignInWithAppleData(req.body, jkt, requestLogger);

  res.set('Cache-Control', 'no-store');
  return res.status(200).json(payload);
};

/**
 * Finalize OAuth login after the authenticated user completes required profile data.
 *
 * Confirms that the OAuth profile is complete, rotates token version state, and
 * returns a fresh token pair for the authenticated user.
 *
 * Route: POST /api/oauth/proceedauth
 * Access: User
 */
export const proceedLogin = async (
  req: Request<{}, ProceedLoginResponse>,
  res: Response<ProceedLoginResponse>,
): Promise<Response<ProceedLoginResponse>> => {
  const requestLogger = req.logger || logger;
  const payload = await proceedLoginData(req.user!.id, req.dpopJkt || undefined, requestLogger);

  res.set('Cache-Control', 'no-store');
  return res.status(200).json(payload);
};
