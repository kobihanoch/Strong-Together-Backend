import { Router } from "express";
import {
  finishUserWorkout,
  getExerciseTracking,
  getWholeUserWorkoutPlan,
} from "../controllers/workoutController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// User Routes
router.get("/getworkout", protect, asyncHandler(getWholeUserWorkoutPlan)); // Gets workout plan (whole)
router.get("/gettracking", protect, asyncHandler(getExerciseTracking)); // Gets exercise tracking
router.post("/finishworkout", protect, asyncHandler(finishUserWorkout)); // Save user's finished workout

export default router;
