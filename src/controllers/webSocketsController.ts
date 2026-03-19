import { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/sharedTypes.ts";
import {
  GenerateTicketBody,
  GenerateTicketResponse,
} from "../types/webSocketsTypes.ts";

// @desc    Generates a ticket for websocket connection
// @route   POST /api/ws/generateticket
// @access  Private
export const generateTicket = async (
  req: AuthenticatedRequest<GenerateTicketBody>,
  res: Response<GenerateTicketResponse>,
): Promise<void | Response> => {
  const usernameFromBody = req.body.username; // optional, server can also look up
  const payload = {
    id: req.user.id,
    username: usernameFromBody,
    jti: crypto.randomUUID(), // optional: store in Redis for one-time use
  };

  const ticket = jwt.sign(payload, process.env.JWT_SOCKET_SECRET || "", {
    expiresIn: "5400s", // 1:30 Hrs
    issuer: "strong-together",
    audience: "socket",
  });

  return res.status(201).json({ ticket });
};
