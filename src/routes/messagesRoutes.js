import { Router } from "express";
import {
  getExerciseTracking,
  getWholeUserWorkoutPlan,
} from "../controllers/workoutController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllUserMessages } from "../controllers/messagesController.js";

const router = Router();

// User Routes
router.get("/getmessages", protect, asyncHandler(getAllUserMessages)); // Gets user messages

export default router;
