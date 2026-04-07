import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { finishUserWorkout, getExerciseTracking } from './tracking/tracking.controller.ts';
import { addWorkout, getWholeUserWorkoutPlan } from './plan/plan.controller.ts';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';
import { validate } from '../../shared/middlewares/validateRequest.ts';
import { addWorkoutRequest, getWholeWorkoutPlanRequest } from './plan/plan.schemas.ts';
import { finishWorkoutRequest, getExerciseTrackingRequest } from './tracking/tracking.schemas.ts';

const router = Router();

// User Routes
router.get(
  '/getworkout',
  dpopValidationMiddleware,
  protect,
  validate(getWholeWorkoutPlanRequest),
  asyncHandler(withRlsTx(getWholeUserWorkoutPlan)),
); // Gets workout plan (whole)
router.get(
  '/gettracking',
  dpopValidationMiddleware,
  protect,
  validate(getExerciseTrackingRequest),
  asyncHandler(withRlsTx(getExerciseTracking)),
); // Gets exercise tracking
router.post(
  '/finishworkout',
  dpopValidationMiddleware,
  protect,
  validate(finishWorkoutRequest),
  asyncHandler(withRlsTx(finishUserWorkout)),
); // Save user's finished workout
router.post(
  '/add',
  dpopValidationMiddleware,
  protect,
  validate(addWorkoutRequest),
  asyncHandler(withRlsTx(addWorkout)),
); // Add new workout

export default router;
