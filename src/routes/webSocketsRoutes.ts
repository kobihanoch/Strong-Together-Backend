import { Router } from 'express';
import { generateTicket } from '../controllers/webSocketsController.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';

const router = Router();

// User routes
router.post('/generateticket', dpopValidationMiddleware, protect, asyncHandler(generateTicket)); // User - creates a ws ticket

export default router;
