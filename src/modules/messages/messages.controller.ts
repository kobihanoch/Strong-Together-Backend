import { Request, Response } from 'express';
import { deleteMessageData, getAllMessagesData, markUserMessageAsReadData } from './messages.service.ts';
import {
  DeleteMessageParams,
  GetAllUserMessagesQuery,
  MarkMessageAsReadParams,
} from '../../shared/types/api/messages/requests.ts';
import {
  DeleteMessageResponse,
  GetAllUserMessagesResponse,
  MarkMessageAsReadResponse,
} from '../../shared/types/api/messages/responses.ts';

/**
 * Get the authenticated user's message inbox.
 *
 * Returns all messages for the current user, localized to the requested
 * timezone.
 *
 * Route: GET /api/messages/getmessages
 * Access: User
 */
export const getAllUserMessages = async (
  req: Request<{}, GetAllUserMessagesResponse, {}, GetAllUserMessagesQuery>,
  res: Response<GetAllUserMessagesResponse>,
): Promise<Response<GetAllUserMessagesResponse>> => {
  const tz = req.query.tz;
  // Get messages
  const { payload } = await getAllMessagesData(req.user!.id, tz);
  return res.status(200).json(payload);
};

// -----------------------------------

/**
 * Mark a message as read for the authenticated user.
 *
 * Updates the target message only when it belongs to the current user and
 * returns the updated read state.
 *
 * Route: PUT /api/messages/markasread/:id
 * Access: User
 */
export const markUserMessageAsRead = async (
  req: Request<MarkMessageAsReadParams, MarkMessageAsReadResponse>,
  res: Response<MarkMessageAsReadResponse>,
): Promise<Response<MarkMessageAsReadResponse>> => {
  const payload = await markUserMessageAsReadData(req.params.id, req.user!.id);
  return res.status(200).json(payload);
};

/**
 * Delete a message visible to the authenticated user.
 *
 * Removes the target message when the current user is allowed to access it and
 * returns the deleted message identifier.
 *
 * Route: DELETE /api/messages/delete/:id
 * Access: User
 */
export const deleteMessage = async (
  req: Request<DeleteMessageParams, DeleteMessageResponse>,
  res: Response<DeleteMessageResponse>,
): Promise<Response<DeleteMessageResponse>> => {
  const payload = await deleteMessageData(req.params.id, req.user!.id);
  return res.status(200).json(payload);
};
