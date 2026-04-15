import { Router } from 'express';
import { generateTicket } from './web-sockets.controller.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import { generateTicketRequest } from '@strong-together/shared';
import { validate } from '../../common/pipes/validate-request.pipe.ts';

const router = Router();

// User routes
router.post(
  '/generateticket',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(generateTicketRequest),
  asyncHandler(generateTicket),
); // User - creates a ws ticket

export default router;
