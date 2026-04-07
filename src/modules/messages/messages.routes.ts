import { Router } from 'express';
import { deleteMessage, getAllUserMessages, markUserMessageAsRead } from './messages.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { protect } from '../../shared/middlewares/auth-middleware.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { getAllMessagesRequest, markMessageAsReadRequest, deleteMessageRequest } from './messages.schemas.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';

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
