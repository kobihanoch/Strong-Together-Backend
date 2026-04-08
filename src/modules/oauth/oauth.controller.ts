import { Request, Response } from 'express';
import { createLogger } from '../../infrastructure/logger.ts';
import { proceedLoginData } from './oauth.service.ts';
import { ProceedLoginResponse } from '../../shared/types/api/oAuth/responses.ts';
const logger = createLogger('controller:oauth');

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
