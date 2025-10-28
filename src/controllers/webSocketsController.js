import createError from "http-errors";
import jwt from "jsonwebtoken";

// @desc    Generates a ticket for websocket connection
// @route   POST /api/ws/generateticket
// @access  Public
export const generateTicket = async (req, res) => {
  const usernameFromBody = req.body?.username; // optional, server can also look up
  const payload = {
    id: req.user.id,
    username: usernameFromBody,
    jti: crypto.randomUUID(), // optional: store in Redis for one-time use
  };

  const ticket = jwt.sign(payload, process.env.JWT_SOCKET_SECRET, {
    expiresIn: "5400s", // 1:30 Hrs
    issuer: "strong-together",
    audience: "socket",
  });

  return res.status(201).json({ ticket });
};
