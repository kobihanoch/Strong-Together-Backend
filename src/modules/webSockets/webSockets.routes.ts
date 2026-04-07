import { Router } from 'express';
import { generateTicket } from './webSockets.controller.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import { generateTicketRequest } from './webSockets.schemas.ts';
import { validate } from '../../shared/middlewares/validateRequest.ts';

const router = Router();

// User routes
router.post(
  '/generateticket',
  dpopValidationMiddleware,
  protect,
  validate(generateTicketRequest),
  asyncHandler(generateTicket),
); // User - creates a ws ticket

export default router;
