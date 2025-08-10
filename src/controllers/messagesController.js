import createError from "http-errors";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";

// @desc    Get all user messages
// @route   GET /api/messages/getmessages
// @access  Private
export const getAllUserMessages = async (req, res) => {
  // Get messages
  const messages =
    await sql`SELECT * FROM messages WHERE receiver_id=${req.user.id}`;

  return res.status(200).json(messages);
};
