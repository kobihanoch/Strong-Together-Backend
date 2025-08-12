import createError from "http-errors";
import { getEndOfWorkoutMessage } from "../templates/messageTemplates.js";
import { success } from "zod";
import {
  queryAllUserMessages,
  queryMarkUserMessageAsRead,
  queryDeleteMessage,
} from "../queries/messageQueries.js";

// @desc    Get all user messages
// @route   GET /api/messages/getmessages
// @access  Private
export const getAllUserMessages = async (req, res) => {
  // Get messages
  const messages = await queryAllUserMessages(req.user.id);

  return res.status(200).json(messages);
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
