import { Router } from 'express';
import { deleteMessage, getAllUserMessages, markUserMessageAsRead } from './messages.controller.ts';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import { withRlsTx } from '../../config/db.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { getAllMessagesRequest, markMessageAsReadRequest, deleteMessageRequest } from './messages.schemas.ts';
import { validate } from '../../middlewares/validateRequest.ts';

const router = Router();

// User Routes
router.get(
  '/getmessages',
  dpopValidationMiddleware,
  protect,
  validate(getAllMessagesRequest),
  asyncHandler(withRlsTx(getAllUserMessages)),
); // Gets user messages
router.put(
  '/markasread/:id',
  dpopValidationMiddleware,
  protect,
  validate(markMessageAsReadRequest),
  asyncHandler(withRlsTx(markUserMessageAsRead)),
); // Gets user messages
router.delete(
  '/delete/:id',
  dpopValidationMiddleware,
  protect,
  validate(deleteMessageRequest),
  asyncHandler(withRlsTx(deleteMessage)),
); // Deletes a user's message

export default router;
