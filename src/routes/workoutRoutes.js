import { Router } from "express";
import { getWholeUserWorkoutPlan } from "../controllers/workoutController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// User Routes
router.get("/getworkout", protect, asyncHandler(getWholeUserWorkoutPlan)); // Gets workout plan (whole)

export default router;
