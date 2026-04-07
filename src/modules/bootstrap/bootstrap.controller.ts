import { Request, Response } from 'express';
import { createLogger } from '../../config/logger.ts';
import { getBootstrapDataPayload } from './bootstrap.service.ts';
import { BootstrapRequestQuery } from '../../types/api/bootstrap/requests.ts';
import { BootstrapResponse } from '../../types/api/bootstrap/responses.ts';

const logger = createLogger('controller:bootstrap');

/**
 * Get the authenticated user's bootstrap payload.
 *
 * Aggregates the initial application payload, including user profile, workout
 * plan, tracking history, inbox data, and aerobics history for the requested
 * timezone.
 *
 * Route: GET /api/bootstrap/get
 * Access: User
 */
export const getBootstrapData = async (
  req: Request<{}, BootstrapResponse, {}, BootstrapRequestQuery>,
  res: Response<BootstrapResponse>,
): Promise<Response<BootstrapResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz || 'Asia/Jerusalem';
  const requestLogger = req.logger || logger;
  const payload = await getBootstrapDataPayload(userId, tz, requestLogger);
  return res.status(200).json(payload);
};
