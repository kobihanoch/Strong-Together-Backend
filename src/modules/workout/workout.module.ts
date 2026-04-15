import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { finishUserWorkout, getExerciseTracking } from './tracking/tracking.controller.ts';
import { addWorkout, getWholeUserWorkoutPlan } from './plan/plan.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { validate } from '../../common/pipes/validate-request.pipe.ts';
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
