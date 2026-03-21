import { Request, Response } from "express";
import createError from "http-errors";
import {
  queryAllUserMessages,
  queryDeleteMessage,
  queryMarkUserMessageAsRead,
} from "../queries/messageQueries.js";
import {
  DeleteMessageRequestParams,
  GetAllUserMessagesRequestQuery,
  MarkMessageAsReadRequestParams,
} from "../types/api/messages/requests.ts";
import {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
} from "../types/api/messages/responses.ts";

/** Pure helper (no req/res) */
export const getAllMessagesData = async (
  userId: string,
  tz: string = "Asia/Jerusalem",
): Promise<{ payload: GetAllUserMessagesResponse }> => {
  // Get messages
  const rows = await queryAllUserMessages(userId, tz); // Fetches sender profile pic path also

  return {
    payload: { messages: rows },
  };
};

// @desc    Get all user messages
// @route   GET /api/messages/getmessages
// @access  Private
export const getAllUserMessages = async (
  req: Request<
    {},
    GetAllUserMessagesResponse,
    {},
    GetAllUserMessagesRequestQuery
  >,
  res: Response<GetAllUserMessagesResponse>,
): Promise<Response<GetAllUserMessagesResponse>> => {
  const tz = req.query.tz;
  // Get messages
  const { payload } = await getAllMessagesData(req.user!.id, tz);
  return res.status(200).json(payload);
};

// -----------------------------------

// @desc    Update message to read
// @route   PUT /api/messages/markmasread/:id
// @access  Private
export const markUserMessageAsRead = async (
  req: Request<MarkMessageAsReadRequestParams, MarkMessageAsReadResponse>,
  res: Response<MarkMessageAsReadResponse>,
): Promise<Response<MarkMessageAsReadResponse>> => {
  // Update the message (won't e effective if trying to change other user's message)
  const rows = await queryMarkUserMessageAsRead(req.params.id, req.user!.id);

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
export const deleteMessage = async (
  req: Request<DeleteMessageRequestParams, DeleteMessageResponse>,
  res: Response<DeleteMessageResponse>,
): Promise<Response<DeleteMessageResponse>> => {
  const rows = await queryDeleteMessage(req.params.id, req.user!.id);
  if (!rows.length) {
    throw createError(404, "Message not found.");
  }
  return res.status(200).json(rows[0]);
};
