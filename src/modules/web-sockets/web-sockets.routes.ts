import { Router } from 'express';
import { generateTicket } from './web-sockets.controller.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../shared/middlewares/authentication.ts';
import { authorize } from '../../shared/middlewares/authorization.ts';
import { generateTicketRequest } from '@strong-together/shared';
import { validate } from '../../shared/middlewares/validate-request.ts';

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
