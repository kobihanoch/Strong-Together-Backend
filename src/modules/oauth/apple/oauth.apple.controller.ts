import { Request, Response } from 'express';
import { createLogger } from '../../../config/logger.ts';
import { createOrSignInWithAppleData } from './oauth.apple.service.ts';
import { validateJkt } from '../oauth.service.ts';
import { AppleOAuthBody } from '../../../types/api/oAuth/requests.ts';
import { OAuthLoginResponse } from '../../../types/api/oAuth/responses.ts';
const logger = createLogger('controller:oauth');

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
