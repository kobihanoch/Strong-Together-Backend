import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { finishUserWorkout, getExerciseTracking } from './tracking/tracking.controller.ts';
import { addWorkout, getWholeUserWorkoutPlan } from './plan/plan.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../shared/middlewares/authentication.ts';
import { authorize } from '../../shared/middlewares/authorization.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';
import {
  addWorkoutRequest,
  finishWorkoutRequest,
  getExerciseTrackingRequest,
  getWholeWorkoutPlanRequest,
} from '@strong-together/shared';

const router = Router();

// User Routes
router.get(
  '/getworkout',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(getWholeWorkoutPlanRequest),
  asyncHandler(withRlsTx(getWholeUserWorkoutPlan)),
); // Gets workout plan (whole)
router.get(
  '/gettracking',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(getExerciseTrackingRequest),
  asyncHandler(withRlsTx(getExerciseTracking)),
); // Gets exercise tracking
router.post(
  '/finishworkout',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(finishWorkoutRequest),
  asyncHandler(withRlsTx(finishUserWorkout)),
); // Save user's finished workout
router.post(
  '/add',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(addWorkoutRequest),
  asyncHandler(withRlsTx(addWorkout)),
); // Add new workout

export default router;
