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

// -----------------------------------
// 1. Need to check both below endpoints
// 2. Need to create a method for sending a system message
// 3. Check 2

// @desc    Update message to read
// @route   PUT /api/messages/markmasread/:id
// @access  Private
export const markUserMessageAsRead = async (req, res) => {
  // Update the message (won't e effective if trying to change other user's message)
  const rows =
    await sql`UPDATE messages AS m SET is_read = TRUE WHERE m.id=${req.params.id} AND m.receiver_id=${req.user.id}
     RETURNING id, is_read`;

  // If message don't exist
  if (!rows.length) {
    throw createError(404, "Message not found");
  }

  // Success
  return res.status(200).json(rows[0]);
};

// @desc    Delete message
// @route   DELETE /api/messages/delete/:id
// @access  Private
export const deleteMessage = async (req, res) => {
  const rows =
    await sql`DELETE FROM messages AS m WHERE m.id=${req.params.id} AND (m.receiver_id=${req.user.id} OR m.sender_id=${req.user.id}) RETURNING id`;
  if (!rows.length) {
    throw createError(404, "Message not found.");
  }
  return res.status(200).json(rows[0]);
};
