import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import { getAllExercises } from './exercises.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';

const router = Router();

// User Routes
router.get(
  '/getall',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  asyncHandler(withRlsTx(getAllExercises)),
); // Gets all exercises

export default router;
