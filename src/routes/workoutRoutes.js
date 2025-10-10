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

const router = Router();

// User Routes
router.get(
  "/getworkout",
  protect,
  asyncHandler(withRlsTx(getWholeUserWorkoutPlan))
); // Gets workout plan (whole)
router.get(
  "/gettracking",
  protect,
  asyncHandler(withRlsTx(getExerciseTracking))
); // Gets exercise tracking
router.post(
  "/finishworkout",
  protect,
  asyncHandler(withRlsTx(finishUserWorkout))
); // Save user's finished workout
router.delete("/delete", protect, asyncHandler(withRlsTx(deleteUserWorkout))); // Deletes user's workout
router.post("/add", protect, asyncHandler(withRlsTx(addWorkout))); // Add new workout

export default router;
