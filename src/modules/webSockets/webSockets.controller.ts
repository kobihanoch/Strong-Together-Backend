import { Request, Response } from 'express';
import { generateTicketData } from './webSockets.service.ts';
import { GenerateTicketBody } from '../../shared/types/api/webSockets/requests.ts';
import { GenerateTicketResponse } from '../../shared/types/api/webSockets/responses.ts';

/**
 * Generate a signed WebSocket connection ticket for the authenticated user.
 *
 * Returns a short-lived signed token that the client can use to establish a
 * Socket.IO session.
 *
 * Route: POST /api/ws/generateticket
 * Access: User
 */
export const generateTicket = async (
  req: Request<{}, GenerateTicketResponse, GenerateTicketBody>,
  res: Response<GenerateTicketResponse>,
): Promise<Response<GenerateTicketResponse>> => {
  const payload = await generateTicketData(req.user!.id, req.body.username);
  return res.status(201).json(payload);
};
