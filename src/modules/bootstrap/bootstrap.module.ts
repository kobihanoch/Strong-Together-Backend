import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import { getBootstrapData } from './bootstrap.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { bootstrapRequest } from '@strong-together/shared';
import { validate } from '../../common/pipes/validate-request.pipe.ts';

const router = Router();

// User Routes
router.get(
  '/get',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(bootstrapRequest),
  asyncHandler(withRlsTx(getBootstrapData)),
); // Gets all exercises

export default router;
