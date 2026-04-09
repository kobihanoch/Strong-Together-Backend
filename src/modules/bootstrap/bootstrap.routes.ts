import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../shared/middlewares/authentication.ts';
import { authorize } from '../../shared/middlewares/authorization.ts';
import { getBootstrapData } from './bootstrap.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { bootstrapRequest } from '@strong-together/shared';
import { validate } from '../../shared/middlewares/validate-request.ts';

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
