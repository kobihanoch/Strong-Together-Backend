import { Router } from "express";
import {
  getExerciseTracking,
  getWholeUserWorkoutPlan,
} from "../controllers/workoutController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// User Routes
router.get("/getworkout", protect, asyncHandler(getWholeUserWorkoutPlan)); // Gets workout plan (whole)
router.get("/gettracking", protect, asyncHandler(getExerciseTracking)); // Gets exercise tracking

export default router;
