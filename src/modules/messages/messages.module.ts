import { Router } from 'express';
import { deleteMessage, getAllUserMessages, markUserMessageAsRead } from './messages.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { getAllMessagesRequest, markMessageAsReadRequest, deleteMessageRequest } from '@strong-together/shared';
import { validate } from '../../common/pipes/validate-request.pipe.ts';

const router = Router();

// User Routes
router.get(
  '/getmessages',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(getAllMessagesRequest),
  asyncHandler(withRlsTx(getAllUserMessages)),
); // Gets user messages
router.put(
  '/markasread/:id',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(markMessageAsReadRequest),
  asyncHandler(withRlsTx(markUserMessageAsRead)),
); // Gets user messages
router.delete(
  '/delete/:id',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(deleteMessageRequest),
  asyncHandler(withRlsTx(deleteMessage)),
); // Deletes a user's message

export default router;
