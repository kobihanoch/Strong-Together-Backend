import { Router } from 'express';
import { withRlsTx } from '../../config/db.ts';
import {
  addWorkout,
  finishUserWorkout,
  getExerciseTracking,
  getWholeUserWorkoutPlan,
} from './workoutController.ts';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { validate } from '../../middlewares/validateRequest.ts';
import { addWorkoutRequest } from './addWorkoutRequest.schema.ts';
import { finishWorkoutRequest } from './finishUserWorkoutRequest.schema.ts';
import { getExerciseTrackingRequest } from './getExerciseTrackingRequest.schema.ts';
import { getWholeWorkoutPlanRequest } from './getWholeUserWorkoutPlanRequest.schema.ts';

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
