import { Request, Response } from 'express';
import { createLogger } from '../../../infrastructure/logger.ts';
import { createOrSignInWithGoogleData } from './google.service.ts';
import { validateJkt } from '../oauth.service.ts';
import { GoogleOAuthBody } from '../../../shared/types/api/oauth/requests.ts';
import { OAuthLoginResponse } from '../../../shared/types/api/oauth/responses.ts';
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
