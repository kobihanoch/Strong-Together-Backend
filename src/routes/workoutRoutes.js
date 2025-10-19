import { Router } from "express";
import {
  addWorkout,
  deleteUserWorkout,
  finishUserWorkout,
  getExerciseTracking,
  getWholeUserWorkoutPlan,
} from "../controllers/workoutController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";

const router = Router();

// User Routes
router.get(
  "/getworkout",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getWholeUserWorkoutPlan))
); // Gets workout plan (whole)
router.get(
  "/gettracking",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getExerciseTracking))
); // Gets exercise tracking
router.post(
  "/finishworkout",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(finishUserWorkout))
); // Save user's finished workout
router.delete(
  "/delete",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(deleteUserWorkout))
); // Deletes user's workout
router.post(
  "/add",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(addWorkout))
); // Add new workout

export default router;
