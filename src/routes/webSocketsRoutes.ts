import { Router } from 'express';
import { generateTicket } from '../controllers/webSocketsController.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { generateTicketRequest } from '../validators/webSockets/generateTicketRequest.schema.ts';
import { validate } from '../middlewares/validateRequest.ts';

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
