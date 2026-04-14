import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.ts';
import { authorize } from '../../shared/middlewares/authorization.ts';
import { getAllExercises } from './exercises.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';

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
