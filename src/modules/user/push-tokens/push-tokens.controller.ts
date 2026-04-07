import { Request, Response } from 'express';
import { saveUserPushTokenData } from './push-tokens.service.ts';
import { SaveUserPushTokenBody } from '../../../types/api/user/requests.ts';

/**
 * Save or update the authenticated user's push notification token.
 *
 * Persists the submitted device push token for future notification delivery.
 *
 * Route: PUT /api/users/pushtoken
 * Access: User
 */
export const saveUserPushToken = async (
  req: Request<{}, {}, SaveUserPushTokenBody>,
  res: Response,
): Promise<Response> => {
  await saveUserPushTokenData(req.user!.id, req.body);
  return res.status(204).end();
};
