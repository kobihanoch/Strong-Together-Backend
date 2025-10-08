import createError from "http-errors";
import {
  queryAllUserMessages,
  queryDeleteMessage,
  queryMarkUserMessageAsRead,
} from "../queries/messageQueries.js";

/** Pure helper (no req/res) */
export const getAllMessagesData = async (userId, tz = "Asia/Jerusalem") => {
  // Get messages
  const rows = await queryAllUserMessages(userId, tz); // Fetches sender profile pic path also

  return {
    payload: { messages: rows },
  };
};

// @desc    Get all user messages
// @route   GET /api/messages/getmessages
// @access  Private
export const getAllUserMessages = async (req, res) => {
  const tz = req.query.tz;
  // Get messages
  const { payload } = await getAllMessagesData(req.user.id, tz);
  return res.status(200).json(payload);
};

// -----------------------------------

// @desc    Update message to read
// @route   PUT /api/messages/markmasread/:id
// @access  Private
export const markUserMessageAsRead = async (req, res) => {
  // Update the message (won't e effective if trying to change other user's message)
  const rows = await queryMarkUserMessageAsRead(req.params.id, req.user.id);

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
  const rows = await queryDeleteMessage(req.params.id, req.user.id);
  if (!rows.length) {
    throw createError(404, "Message not found.");
  }
  return res.status(200).json(rows[0]);
};
