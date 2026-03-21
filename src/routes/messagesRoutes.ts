import { Router } from 'express';
import { deleteMessage, getAllUserMessages, markUserMessageAsRead } from '../controllers/messageController.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// User Routes
router.get('/getmessages', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAllUserMessages))); // Gets user messages
router.put('/markasread/:id', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(markUserMessageAsRead))); // Gets user messages
router.delete('/delete/:id', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(deleteMessage))); // Deletes a user's message

export default router;
